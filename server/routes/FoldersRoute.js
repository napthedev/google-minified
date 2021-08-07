const express = require("express");
const route = express.Router();

const Folders = require("../models/Folders");
const { verifyJWT, verifyJWTNotStrict } = require("../verifyJWT");

route.post("/get-folder", verifyJWTNotStrict, async (req, res) => {
  try {
    const folder = await Folders.findOne({ _id: req.body._id });

    if (!folder) return res.sendStatus(404);

    const pathObj = await Promise.all(
      folder.path.map(async (e) => {
        const childFolder = await Folders.findOne({ _id: e });
        return childFolder;
      })
    );

    res.send({ folder, permission: req.user?.id === folder.userId, pathObj });
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/folder-child", verifyJWTNotStrict, async (req, res) => {
  try {
    let folderChild;
    if (req.body.parentId === "") {
      folderChild = await Folders.find({ parentId: "", userId: req.user?.id });
    } else {
      folderChild = await Folders.find({ parentId: req.body.parentId });
    }

    res.send(folderChild);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/create", verifyJWT, async (req, res) => {
  try {
    const newFolder = new Folders({
      name: req.body.name,
      path: req.body.path,
      parentId: req.body.parentId,
      userId: req.user.id,
    });

    const saved = await newFolder.save();

    res.send(saved);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
