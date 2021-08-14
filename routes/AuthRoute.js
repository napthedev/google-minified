const express = require("express");
const route = express.Router();
const { verifyJWT } = require("../verifyJWT");
const Auth = require("../models/Auth");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

const getDomainWithoutSubdomain = (url) => {
  const urlParts = new URL(url).hostname.split(".");

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".");
};

route.get("/verify/:id", async (req, res) => {
  try {
    const data = await Auth.findOne({ id: req.params.id });

    if (!data) return res.status(404).send("404 not found");

    if (data.emailVerified) return res.send("Your email has already been verified!");

    data.emailVerified = true;
    await data.save();
    res.send("Your email has been verified!");
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/sign-up", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.username)
      return res.status(400).send({
        code: "missing-data",
        message: "Missing email, password or username",
      });

    const data = await Auth.findOne({ email: req.body.email });

    if (data)
      return res.status(400).send({
        code: "email-in-use",
        message: "This email has already been in use",
      });

    const user = new Auth({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const saved = await user.save();

    const emailRes = await fetch("https://mailer-sender-api.herokuapp.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: req.body.email,
        subject: "Verify your email for googlify",
        text: "Click this link to verify your email " + req.protocol + "://" + req.get("host") + "/auth/verify/" + saved.id,
      }),
    });

    const emailData = await emailRes.json();

    res.send({
      user: saved,
      emailSent: emailData,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/sign-in", verifyJWT, async (req, res) => {
  try {
    if (!req.user.email || !req.user.password)
      return res.status(400).send({
        code: "missing-data",
        message: "Missing email or password",
      });

    const data = await Auth.findOne({ email: req.user.email });
    if (!data)
      return res.status(404).send({
        code: "email-not-found",
        message: "The email provided isn't connected to any account",
      });

    if (data.password !== req.user.password)
      return res.status(400).send({
        code: "incorrect-password",
        message: "Password is incorrect",
      });

    if (!data.emailVerified)
      return res.status(400).send({
        code: "email-not-verified",
        message: "Your email hasn't been verified, try to check the spam folder",
      });

    const user = {
      id: data.id,
      username: data.username,
      email: data.email,
      password: data.password,
    };

    const accessToken = jwt.sign(user, process.env.JWT_SECRET_TOKEN, { expiresIn: "7d" });

    let date = new Date();
    date.setDate(date.getDate() + 7);

    res
      .cookie("token", accessToken, {
        httpOnly: true,
        expires: date,
        path: "/",
        domain: getDomainWithoutSubdomain(req.protocol + "://" + req.get("host")) !== "localhost" ? "." + getDomainWithoutSubdomain(req.protocol + "://" + req.get("host")) : "localhost",
      })
      .send({
        user,
        accessToken,
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

route.get("/sign-out", (req, res) => {
  let date = new Date();
  date.setSeconds(date.getSeconds() + 1);

  res
    .cookie("token", "token", {
      httpOnly: true,
      expires: date,
      path: "/",
      domain: getDomainWithoutSubdomain(req.protocol + "://" + req.get("host")) !== "localhost" ? "." + getDomainWithoutSubdomain(req.protocol + "://" + req.get("host")) : "localhost",
    })
    .send("Logged out");
});

module.exports = route;
