const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

require("dotenv/config");

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => console.log("MongoDB database connected"));

const AuthRoute = require("./routes/AuthRoute");
const FormsRoute = require("./routes/FormsRoute");
const DriveRoute = require("./routes/DriveRoute");
const DocumentsRoute = require("./routes/DocumentsRoute");

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(fileUpload({ createParentPath: true, useTempFiles: true }));

app.use(cookieParser());

app.enable("trust proxy");

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.send("Google Minified Server");
});

app.use("/auth", AuthRoute);
app.use("/forms", FormsRoute);
app.use("/drive", DriveRoute);
app.use("/docs", DocumentsRoute);

io.of("/docs").on("connection", (socket) => {
  let room = "";

  socket.on("join-room", (data) => {
    socket.join(data);
    room = data;
  });

  socket.on("name", (value) => {
    socket.broadcast.to(room).emit("name", value);
  });
  socket.on("editable", (value) => {
    socket.broadcast.to(room).emit("editable", value);
  });
  socket.on("update-data", (data) => {
    socket.broadcast.to(room).emit("new-data", data);
  });
});

io.of("/drive").on("connection", (socket) => {
  socket.on("join-room", (roomId) => socket.join(roomId));
});

io.of("/submits").on("connection", (socket) => {
  socket.on("join-room", (roomId) => socket.join(roomId));
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));
