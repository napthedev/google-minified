const express = require("express");
const route = express.Router();
const { verifyJWT } = require("../verifyJWT");
const Auth = require("../models/Auth");
const jwt = require("jsonwebtoken");

const getDomainWithoutSubdomain = (url) => {
  const urlParts = new URL(url).hostname.split(".");

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".");
};

route.post("/google", verifyJWT, async (req, res) => {
  try {
    const data = await Auth.findOne({ email: req.user.email });
    if (!data) {
      await Auth.create({
        email: req.user.email,
        username: req.user.username,
        id: req.user.id,
        photoURL: req.user.photoURL,
      });
    }

    const user = {
      email: req.user.email,
      username: req.user.username,
      id: req.user.id,
      photoURL: req.user.photoURL,
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
      .send(user);
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
