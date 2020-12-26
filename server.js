const express = require("express");
const cors = require("cors");
const router = require("./routes/routes");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const app = express();
const URL =
  "mongodb+srv://admin:4UFr6IR3p1hdUyTL@cluster0.cy2dk.mongodb.net/livingDesireDB?retryWrites=true&w=majority";

mongoose.connect(
  URL,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  () => console.log("connected to the database")
);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Listening");
});

app.use("/api", router);

//error handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    status: error.status || 500,
    message: error.message || "Internal Server Error",
  });
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
