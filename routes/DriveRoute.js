const express = require("express");
const route = express.Router();
const { generate } = require("shortid");

const Folders = require("../models/Folders");
const Files = require("../models/Files");
const { verifyJWT, verifyJWTNotStrict } = require("../verifyJWT");

route.post("/folder", verifyJWTNotStrict, async (req, res) => {
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
    console.log(error);
    res.sendStatus(500);
  }
});

route.post("/child", verifyJWTNotStrict, async (req, res) => {
  try {
    let folderChild;
    let filesChild;
    if (!req.body.path) {
      if (!req.user?.id) return res.sendStatus(400);

      folderChild = await Folders.find({ path: [], userId: req.user.id });
      filesChild = await Files.find({ path: [], userId: req.user.id });
    } else {
      folderChild = await Folders.find({ path: req.body.path });
      filesChild = await Files.find({ path: req.body.path });
    }

    res.send({ folders: folderChild, files: filesChild });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.post("/create-folder", verifyJWT, async (req, res) => {
  try {
    const newFolder = new Folders({
      name: req.body.name,
      path: req.body.path,
      userId: req.user.id,
    });

    const saved = await newFolder.save();

    req.io
      .of("/drive")
      .to(saved.path.slice(-1)[0] || saved.userId)
      .emit("new-data", "");

    res.send(saved);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.post("/file-info", async (req, res) => {
  try {
    const file = await Files.findOne({ _id: req.body._id });

    if (!file) return res.sendStatus(404);

    res.send(file);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.post("/upload", verifyJWT, async (req, res) => {
  try {
    const newFile = new Files({
      _id: generate(),
      name: req.body.name,
      path: JSON.parse(req.body.path),
      userId: req.user.id,
      type: req.body.type,
      url: req.body.url,
    });

    const saved = await newFile.save();

    req.io
      .of("/drive")
      .to(saved.path.slice(-1)[0] || saved.userId)
      .emit("new-data", "");

    res.send(saved);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.post("/rename", verifyJWT, async (req, res) => {
  try {
    if (req.body.type === "file") {
      const existing = await Files.findOne({
        _id: req.body._id,
      });

      if (!existing) return res.sendStatus(404);

      if (existing.userId !== req.user.id) return res.sendStatus(403);

      existing.name = `${req.body.name}.${existing.name.split(".").slice(-1)[0]}`;
      const saved = await existing.save();

      req.io
        .of("/drive")
        .to(saved.path.slice(-1)[0] || saved.userId)
        .emit("new-data", "");

      res.send(saved);
    } else if (req.body.type === "folder") {
      existing = await Folders.findOne({
        _id: req.body._id,
      });

      if (!existing) return res.sendStatus(404);
      if (existing.userId !== req.user.id) return res.sendStatus(403);

      existing.name = req.body.name;
      const saved = await existing.save();

      req.io
        .of("/drive")
        .to(saved.path.slice(-1)[0] || saved.userId)
        .emit("new-data", "");

      res.send(saved);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

route.delete("/", verifyJWT, async (req, res) => {
  try {
    if (req.body.type === "file") {
      const file = await Files.findOne({ _id: req.body._id });
      if (file.userId !== req.user.id) return res.sendStatus(403);

      await file.delete();

      req.io
        .of("/drive")
        .to(file.path.slice(-1)[0] || file.userId)
        .emit("new-data", "");

      return res.sendStatus(200);
    }
    if (req.body.type === "folder") {
      const folder = await Folders.findOne({ _id: req.body._id });
      if (folder.userId !== req.user.id) return res.sendStatus(403);

      await folder.delete();

      await Folders.deleteMany({ path: req.body._id });
      await Files.deleteMany({ path: req.body._id });

      req.io
        .of("/drive")
        .to(folder.path.slice(-1)[0] || folder.userId)
        .emit("new-data", "");

      return res.sendStatus(200);
    }
    res.sendStatus(400);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = route;
