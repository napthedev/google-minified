const express = require("express");
const route = express.Router();
const verifyJWT = require("../VerifyJWT");
const Auth = require("../models/Auth");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

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

route.post("/register", async (req, res) => {
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

    const emailRes = await fetch("https://mailer-api.up.railway.app/auto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: req.body.email,
        subject: "Verify your email for google form clone",
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

route.post("/login", verifyJWT, async (req, res) => {
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
        message: "Your email hasn't been verified",
      });

    const user = {
      id: data.id,
      username: data.username,
      email: data.email,
      password: data.password,
    };

    const accessToken = jwt.sign(user, process.env.JWT_SECRET_TOKEN);

    let date = new Date();
    date.setDate(date.getDate() + 7);

    let domain = req.get("host");
    if (domain.startsWith("localhost")) domain = "localhost";
    else if (domain.split(".").length >= 3) domain = domain.replace(domain.split(".")[0], "");

    res
      .cookie("token", accessToken, {
        httpOnly: true,
        expires: date,
        domain: domain,
        sameSite: "none",
        secure: true,
      })
      .send({
        user,
        accessToken,
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

route.get("/signout", (req, res) => {
  res.clearCookie("token").sendStatus(200);
});

module.exports = route;
