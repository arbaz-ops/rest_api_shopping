const express = require("express");
const app = express();
const dotenv = require("dotenv");
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./api/routes/users");
const port = process.env.PORT || 3000;

dotenv.config();

mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  (err, result) => {
    if (err) {
      console.log("Cannot Connect to DB...");
    } else {
      console.log("DB Connected...");
    }
  }
);

app.use(morgan("dev"));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

app.use("/products", productRoutes);

app.use("/orders", orderRoutes);

app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found...");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port, () => {
  console.log(`Listening to localhost:${port}`);
});
