const express = require("express");
const route = express.Router();
const { verifyJWT } = require("../verifyJWT");
const Documents = require("../models/Documents");

route.get("/create", verifyJWT, async (req, res) => {
  try {
    const newForm = new Documents({
      userId: req.user.id,
      data: "",
    });

    const saved = await newForm.save();
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

route.patch("/", verifyJWT, async (req, res) => {
  try {
    const myForm = await Documents.findOne({
      _id: req.body._id,
    });

    if (myForm.userId !== req.user.id) return res.status(400).send("No permission to edit form");

    if (myForm) {
      myForm.title = req.body.title;
      myForm.description = req.body.description;
      myForm.content = req.body.content;
      const saved = await myForm.save();
      return res.send(saved);
    }

    res.sendStatus(404);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.delete("/", verifyJWT, async (req, res) => {
  try {
    const myForm = await Documents.findOne({
      _id: req.body._id,
    });

    if (!myForm) return res.sendStatus(404);

    if (myForm.userId !== req.user.id) return res.sendStatus(403);

    const deleted = await Documents.deleteOne({
      _id: req.body._id,
    });

    res.send({ deleted });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
