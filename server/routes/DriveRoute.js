const express = require("express");
const route = express.Router();

const Folders = require("../models/Folders");
const Files = require("../models/Files");
const { verifyJWT, verifyJWTNotStrict } = require("../verifyJWT");

route.post("/get-folder", verifyJWTNotStrict, async (req, res) => {
  try {
    const folder = await Folders.findOne({ _id: req.body._id });

    if (!folder) return res.sendStatus(404);

    let pathObj;
    if (folder.path.length === 1 && folder.path[0] === null) {
      pathObj = [];
    } else {
      pathObj = await Promise.all(
        folder.path.map(async (e) => {
          const childFolder = await Folders.findOne({ _id: e });
          return childFolder;
        })
      );
    }

    res.send({ folder, permission: req.user?.id === folder.userId, pathObj });
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/folder-child", verifyJWTNotStrict, async (req, res) => {
  try {
    let folderChild;
    let filesChild;
    if (!req.body.parentId) {
      if (!req.user?.id) return res.sendStatus(400);

      folderChild = await Folders.find({ parentId: null, userId: req.user.id });
      filesChild = await Files.find({ parentId: null, userId: req.user.id });
    } else {
      folderChild = await Folders.find({ parentId: req.body.parentId });
      filesChild = await Files.find({ parentId: req.body.parentId });
    }

    res.send({ folders: folderChild, files: filesChild });
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/create-folder", verifyJWT, async (req, res) => {
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

route.post("/get-file", verifyJWTNotStrict, async (req, res) => {
  try {
    const file = await Files.findOne({ _id: req.body._id });

    if (!file) return res.sendStatus(404);

    res.send(file);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/create-file", verifyJWT, async (req, res) => {
  try {
    const newFile = new Files({
      name: req.body.name,
      parentId: req.body.parentId,
      userId: req.user.id,
      url: req.body.url,
      type: req.body.type,
    });

    const saved = await newFile.save();

    res.send(saved);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/rename", verifyJWT, async (req, res) => {
  try {
    let existing;
    if (req.body.type === "file") {
      existing = await Files.findOne({
        _id: req.body._id,
      });
    } else if (req.body.type === "folder") {
      existing = await Folders.findOne({
        _id: req.body._id,
      });
    }

    if (!existing) return res.sendStatus(404);

    if (existing.userId !== req.user.id) return res.sendStatus(403);

    if (req.body.type === "file") existing.name = `${req.body.name}.${existing.name.split(".")[existing.name.split(".").length - 1]}`;
    else if (req.body.type === "folder") existing.name = req.body.name;

    const saved = await existing.save();

    res.send(saved);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/delete", verifyJWT, async (req, res) => {
  try {
    if (req.body.type === "file") {
      const file = await Files.findOne({ _id: req.body._id });
      if (file.userId !== req.user.id) return res.sendStatus(403);
      const deleted = await file.delete();
      return res.send(deleted);
    }
    if (req.body.type === "folder") {
      const folder = await Folders.findOne({ _id: req.body._id });
      if (folder.userId !== req.user.id) return res.sendStatus(403);

      const deleted = await folder.delete();

      const deletedFolders = await Folders.deleteMany({ path: req.body._id });
      const deletedFiles = await Files.deleteMany({ path: req.body._id });

      return res.send({ deletedFiles, deletedFolders, deleted });
    }
    res.sendStatus(400);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
