const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv/config");

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("MongoDB database connected"));

const AuthRoute = require("./routes/AuthRoute");
const FormsRoute = require("./routes/FormsRoute");
const SubmitsRoute = require("./routes/SubmitsRoute");
const DriveRoute = require("./routes/DriveRoute");

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());

app.enable("trust proxy");

app.get("/", (req, res) => {
  res.send("Googlify Server");
});

app.use("/auth", AuthRoute);
app.use("/forms", FormsRoute);
app.use("/submits", SubmitsRoute);
app.use("/drive", DriveRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
