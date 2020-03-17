const Product = require("../models/product");
const Order = require("../models/order");
const mongoose = require("mongoose");

module.exports.orders_get_all_order = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .select("quantity product _id")
      .populate("product", "name price", "Product");
    const counts = orders.length;
    res.status(200).json({
      message: "Successfuly fetched...",
      counts: counts,
      orderDetails: orders.map(result => {
        return {
          _id: result._id,
          product: result.productID,
          quantity: result.quantity,
          request: {
            method: "GET",
            url: "http://" + req.hostname + ":3000/orders/" + result._id
          }
        };
      })
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports.orders_create_order = async (req, res, next) => {
  Product.findById(req.body.productID, (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(404).json({
        error: err.message
      });
    } else {
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productID
      });
      order.save((err, result) => {
        if (err) {
          console.log(err.message);
          res.status(500).json({
            error: err.message
          });
        } else {
          res.status(201).json({
            message: "Order Created...",
            orderDetails: result,
            request: {
              method: "GET",
              url: "http://" + req.hostname + ":3000/orders/" + result._id
            }
          });
        }
      });
    }
  });
};

module.exports.orders_get_order = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderID)
      .select("quantity product _id")
      .populate("product", "name price", "Product");

    if (!order) {
      res.status(404).json({
        message: "Order Not Found..."
      });
    } else {
      res.status(200).json({
        message: "Successfuly Fetched...",
        orderDetails: order,
        request: {
          method: "GET",
          message: "See all orders",
          url: "http://" + req.hostname + ":3000/orders"
        }
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports.orders_delete_order = async (req, res, next) => {
  try {
    const order = await Order.remove({ _id: req.params.orderID });
    res.status(200).json({
      message: "Order Deleted...",
      order: order,
      request: {
        method: "GET",
        message: "See all orders",
        url: "http://" + req.hostname + ":3000/orders"
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message
    });
  }
};
