const express = require("express");
const route = express.Router();
const { verifyJWT } = require("../verifyJWT");
const Auth = require("../models/Auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const md5 = require("md5");
const EmailVerificationTemplate = require("../public/EmailVerificationTemplate");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getDomainWithoutSubdomain = (url) => {
  const urlParts = new URL(url).hostname.split(".");

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".");
};

route.get("/verify/:id", async (req, res) => {
  try {
    const data = await Auth.findOneAndUpdate({ id: req.params.id }, { emailVerified: true });

    if (!data) return res.sendFile(path.join(__dirname + "./../public/NotFound.html"));

    res.sendFile(path.join(__dirname + "./../public/EmailVerified.html"));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.post("/sign-up", async (req, res) => {
  try {
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

    let mailOptions = {
      from: "googlminifiedservice@gmail.com",
      to: req.body.email,
      subject: "Verify your email for google minified",
      html: EmailVerificationTemplate(req.body.username, req.protocol + "://" + req.get("host") + "/auth/verify/" + saved.id),
    };

    sgMail
      .send(mailOptions)
      .then((info) => {
        res.send({
          user: saved,
          emailSent: { success: true, info },
        });
      })
      .catch((error) => {
        console.log(error);
        res.send({
          user: saved,
          emailSent: { success: false, error },
        });
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.post("/sign-in", verifyJWT, async (req, res) => {
  try {
    const data = await Auth.findOne({ email: req.user.email });
    if (!data)
      return res.status(404).send({
        code: "email-not-found",
        message: "The email provided isn't connected to any account",
      });

    let passwordCompare = await bcrypt.compare(req.user.password, data.password);
    if (req.cookies.token) {
      passwordCompare = req.user.password === data.password ? true : passwordCompare;
    }
    if (!passwordCompare)
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
        domain: getDomainWithoutSubdomain(req.get("origin")) !== "localhost" ? "." + getDomainWithoutSubdomain(req.get("origin")) : "localhost",
      })
      .send({ ...user, avatar: `https://www.gravatar.com/avatar/${md5(user.email)}?d=${encodeURIComponent(`https://ui-avatars.com/api/${user.username}/64/0D8ABC/FFFFFF`)}` });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
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
      domain: getDomainWithoutSubdomain(req.get("origin")) !== "localhost" ? "." + getDomainWithoutSubdomain(req.get("origin")) : "localhost",
    })
    .sendStatus(200);
});

module.exports = route;
