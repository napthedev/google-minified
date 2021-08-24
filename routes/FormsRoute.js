const express = require("express");
const route = express.Router();
const { verifyJWT } = require("../verifyJWT");
const Forms = require("../models/Forms");
const Submits = require("../models/Submits");
const napid = require("napid");

route.get("/create", verifyJWT, async (req, res) => {
  try {
    const newForm = new Forms({
      userId: req.user.id,
      title: "Untitled form",
      description: "Form description",
      content: JSON.stringify([
        {
          id: napid(),
          type: "text",
          value: {
            title: "Untitled question",
            answer: "",
          },
        },
      ]),
    });

    const saved = await newForm.save();
    res.json(saved);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.get("/", verifyJWT, async (req, res) => {
  try {
    const myForms = await Forms.find({
      userId: req.user.id,
    });

    res.send(myForms);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/update", verifyJWT, async (req, res) => {
  try {
    const myForm = await Forms.findOne({
      _id: req.body._id,
    });

    if (myForm.userId !== req.user.id) return res.sendStatus(403);

    if (myForm) {
      myForm.title = req.body.title;
      myForm.description = req.body.description;
      myForm.content = req.body.content;
      const saved = await myForm.save();
      return res.send(saved);
    }

    res.status(404).send("Form ID not found");
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/form", verifyJWT, async (req, res) => {
  try {
    const myForm = await Forms.findOne({
      _id: req.body._id,
    });

    if (!myForm) return res.sendStatus(404);

    if (req.user.id !== myForm.userId) return res.sendStatus(403);

    res.send({ form: myForm });
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/form-response", async (req, res) => {
  try {
    const myForm = await Forms.findOne({
      _id: req.body._id,
    });

    if (!myForm) return res.sendStatus(404);

    res.send({ form: myForm });
  } catch (error) {
    res.status(500).send(error);
  }
});

route.delete("/", verifyJWT, async (req, res) => {
  try {
    const myForm = await Forms.findOne({
      _id: req.body._id,
    });

    if (!myForm) return res.sendStatus("404");

    if (myForm.userId !== req.user.id) return res.sendStatus(403);

    const deleted = await Forms.deleteOne({
      _id: req.body._id,
    });

    const deletedSubmits = await Submits.deleteMany({
      _id: req.body._id,
    });

    res.send({ deleted, deletedSubmits });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
