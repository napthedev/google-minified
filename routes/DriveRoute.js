const express = require("express");
const route = express.Router();
const path = require("path");
const napid = require("napid");
const fs = require("fs");

const Folders = require("../models/Folders");
const Files = require("../models/Files");
const { verifyJWT, verifyJWTNotStrict } = require("../verifyJWT");

route.post("/folder", verifyJWTNotStrict, async (req, res) => {
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
    filesChild = filesChild.map((file) => {
      if (!fs.existsSync(path.join(__dirname, `./../files/${file._id}`))) return false;
      const fileName = fs.readdirSync(path.join(__dirname, `./../files/${file._id}`))[0];
      return { ...file.toObject(), name: fileName, url: `${req.protocol}://${req.get("host")}/drive/file/${file._id}` };
    });

    filesChild = filesChild.filter((e) => e);

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
      userId: req.user.id,
    });

    const saved = await newFolder.save();

    res.send(saved);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.get("/file/:id", (req, res) => {
  try {
    const fileName = fs.readdirSync(path.join(__dirname, `./../files/${req.params.id}`))[0];
    const filePath = path.join(__dirname, `./../files/${req.params.id}`, fileName);
    if (Boolean(Number(req.query.dl))) res.download(filePath);
    else res.sendFile(filePath);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/file-info", async (req, res) => {
  try {
    const file = await Files.findOne({ _id: req.body._id });

    if (!file) return res.sendStatus(404);

    if (!fs.existsSync(path.join(__dirname, `./../files/${file._id}`))) return res.sendStatus(404);
    const fileName = fs.readdirSync(path.join(__dirname, `./../files/${file._id}`))[0];
    res.send({ ...file.toObject(), name: fileName, url: `${req.protocol}://${req.get("host")}/drive/file/${file._id}` });
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/upload", verifyJWT, async (req, res) => {
  try {
    const file = req.files.file;
    if (!file) return res.sendStatus(400);

    let fileId = napid();

    let uploadPath = path.join(__dirname, `./../files/${fileId}/${file.name}`);

    file.mv(uploadPath, async (err) => {
      if (err) return res.status(500).send(err);

      const newFile = new Files({
        _id: fileId,
        name: file.name,
        path: JSON.parse(req.body.path),
        userId: req.user.id,
        type: file.mimetype,
      });

      const saved = await newFile.save();

      res.send(saved);
    });
  } catch (error) {
    res.status(500).send(error);
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

      const fileName = fs.readdirSync(path.join(__dirname, `./../files/${req.body._id}`))[0];
      const filePath = path.join(__dirname, `./../files/${req.body._id}`, fileName);
      const newPath = path.join(__dirname, `./../files/${req.body._id}`, `${req.body.name}.${fileName.split(".").slice(-1)[0]}`);

      fs.renameSync(filePath, newPath);

      existing.name = `${req.body.name}.${fileName.split(".").slice(-1)[0]}`;
      const saved = await existing.save();

      res.send(saved);
    } else if (req.body.type === "folder") {
      existing = await Folders.findOne({
        _id: req.body._id,
      });

      if (!existing) return res.sendStatus(404);
      if (existing.userId !== req.user.id) return res.sendStatus(403);

      existing.name = req.body.name;
      const saved = await existing.save();
      res.send(saved);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

route.delete("/", verifyJWT, async (req, res) => {
  try {
    if (req.body.type === "file") {
      const file = await Files.findOne({ _id: req.body._id });
      if (file.userId !== req.user.id) return res.sendStatus(403);
      fs.rmdirSync(path.join(__dirname, `./../files/${file._id}`), { recursive: true });
      await file.delete();
      return res.sendStatus(200);
    }
    if (req.body.type === "folder") {
      const folder = await Folders.findOne({ _id: req.body._id });
      if (folder.userId !== req.user.id) return res.sendStatus(403);

      await folder.delete();

      await Folders.deleteMany({ path: req.body._id });
      const files = await Files.find({ path: req.body._id });

      for (let i = 0; i < files.length; i++) {
        fs.rmdirSync(path.join(__dirname, `./../files/${files[i]._id}`), { recursive: true });
        await files[i].delete();
      }

      return res.sendStatus(200);
    }
    res.sendStatus(400);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
