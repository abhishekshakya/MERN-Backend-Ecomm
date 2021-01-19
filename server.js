const express = require("express");
const cors = require("cors");
const router = require("./routes/routes");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const cart = require("./routes/cart");
const wishList = require("./routes/wishlist");
const orders = require("./routes/order");
const address = require("./routes/address");
const pagination = require("./routes/pagination");

require("dotenv").config();

// console.log(process.env.URL);

const PORT = process.env.PORT || 5000;
const app = express();
const URL = process.env.URL;

mongoose.connect(
  URL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log("connected to the database")
);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Listening");
});

app.use("/api", router);
app.use("/auth", auth);
app.use("/cart", cart);
app.use("/wishlist", wishList);
app.use("/order", orders);
app.use("/address", address);
app.use("/pagination", pagination);

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
