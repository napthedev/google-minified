const express = require("express");
const route = express.Router();
const { verifyJWT } = require("../verifyJWT");
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
    res.status(500).send(error);
  }
});

route.get("/", verifyJWT, async (req, res) => {
  try {
    const myDocuments = await Documents.find({
      userId: req.user.id,
    });

    res.send(myDocuments);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/document", async (req, res) => {
  try {
    const myDocument = await Documents.findOne({
      _id: req.body._id,
    });

    if (!myDocument) return res.sendStatus(404);

    res.send(myDocument);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.patch("/", async (req, res) => {
  try {
    const myDocument = await Documents.findOne({
      _id: req.body._id,
    });

    if (myDocument) {
      // myDocument.name = req.body.name;
      myDocument.data = req.body.data;
      const saved = await myDocument.save();
      return res.send(saved);
    }

    res.sendStatus(404);
  } catch (error) {
    res.status(500).send(error);
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
    res.status(500).send(error);
  }
});

module.exports = route;
