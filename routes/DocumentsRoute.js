const express = require("express");
const route = express.Router();
const { verifyJWT, verifyJWTNotStrict } = require("../verifyJWT");
const Documents = require("../models/Documents");

route.get("/create", verifyJWT, async (req, res) => {
  try {
    const newDocument = new Documents({
      userId: req.user.id,
      data: "",
    });

    const saved = await newDocument.save();
    res.json(saved);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.get("/", verifyJWT, async (req, res) => {
  try {
    const myDocuments = await Documents.find({
      userId: req.user.id,
    });

    res.send(myDocuments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.post("/document", verifyJWTNotStrict, async (req, res) => {
  try {
    const myDocument = await Documents.findOne({
      _id: req.body._id,
    });

    if (!myDocument) return res.sendStatus(404);

    res.send({ ...myDocument.toObject(), permission: myDocument.userId === req.user?.id });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.patch("/", async (req, res) => {
  try {
    const myDocument = await Documents.findOne({
      _id: req.body._id,
    });

    if (myDocument) {
      myDocument.data = req.body.data;
      await myDocument.save();
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
    const myDocument = await Documents.findOne({
      _id: req.body._id,
    });

    if (myDocument) {
      myDocument.name = req.body.name;
      await myDocument.save();
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
    const myDocument = await Documents.findOne({
      _id: req.body._id,
    });

    if (!myDocument) return res.sendStatus(404);

    if (myDocument.userId !== req.user.id) return res.sendStatus(403);

    const deleted = await Documents.deleteOne({
      _id: req.body._id,
    });

    res.send({ deleted });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = route;
