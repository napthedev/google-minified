const express = require("express");
const route = express.Router();
const { verifyJWT, verifyJWTNotStrict } = require("../verifyJWT");
const Sheets = require("../models/Sheets");

route.get("/create", verifyJWT, async (req, res) => {
  try {
    const newSheet = new Sheets({
      userId: req.user.id,
      data: JSON.stringify(new Array(100).fill(new Array(26).fill(""))),
    });

    const saved = await newSheet.save();
    res.json(saved);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.get("/", verifyJWT, async (req, res) => {
  try {
    const mySheet = await Sheets.find({
      userId: req.user.id,
    });

    res.send(mySheet);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.post("/sheet", verifyJWTNotStrict, async (req, res) => {
  try {
    const mySheet = await Sheets.findOne({
      _id: req.body._id,
    });

    if (!mySheet) return res.sendStatus(404);

    res.send({ ...mySheet.toObject(), permission: mySheet.userId === req.user?.id });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.patch("/", async (req, res) => {
  try {
    const mySheet = await Sheets.findOne({
      _id: req.body._id,
    });

    if (mySheet) {
      mySheet.data = req.body.data;
      await mySheet.save();
      return res.sendStatus(200);
    }

    res.sendStatus(404);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.patch("/name", async (req, res) => {
  try {
    const mySheet = await Sheets.findOne({
      _id: req.body._id,
    });

    if (mySheet) {
      mySheet.name = req.body.name;
      await mySheet.save();
      return res.sendStatus(200);
    }

    res.sendStatus(404);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.delete("/", verifyJWT, async (req, res) => {
  try {
    const mySheet = await Sheets.findOne({
      _id: req.body._id,
    });

    if (!mySheet) return res.sendStatus(404);

    if (mySheet.userId !== req.user.id) return res.sendStatus(403);

    const deleted = await Sheets.deleteOne({
      _id: req.body._id,
    });

    res.send({ deleted });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = route;
