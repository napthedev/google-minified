const express = require("express");
const route = express.Router();
const Submits = require("../models/Submits");

route.post("/create", async (req, res) => {
  try {
    const newSubmit = new Submits({
      _id: req.body._id,
      content: req.body.content,
    });

    const saved = await newSubmit.save();
    res.json(saved);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/get", async (req, res) => {
  try {
    const mySubmits = await Submits.find({
      _id: req.body._id,
    });

    if (!mySubmits) return res.sendStatus(404);

    res.send(mySubmits);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;