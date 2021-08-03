const express = require("express");
const route = express.Router();

const Folders = require("../models/Folders");
const verifyJWT = require("../verifyJWT");

route.get("/my-drive", verifyJWT, async (req, res) => {
  try {
    const myFolders = await Folders.find({ userId: req.user.id, parentId: "" });

    res.send(myFolders);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/folder-child", async (req, res) => {
  try {
    const folder = await Folders.find({ parentId: req.body.parentId });

    res.send(folder);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/create", verifyJWT, async (req, res) => {
  try {
    const newFolder = new Folders({
      name: req.body.name,
      path: req.body.path,
      parentId: req.user.id,
      userId: req.body.userId,
    });

    const saved = await newFolder.save();

    res.send(saved);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/get-folder", verifyJWT, async (req, res) => {
  try {
    const folder = await Folders.findOne({ _id: req.body.id });

    if (!folder) return res.sendStatus(404);

    res.send(folder);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
