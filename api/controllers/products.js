const mongoose = require("mongoose");
const Product = require("../models/product");

module.exports.products_get_all_product = async (req, res, next) => {
  try {
    const products = await Product.find().select("name price _id productImage");
    const count = products.length;
    res.status(200).json({
      message: "Successfuly fetched...",
      counts: count,
      products: products.map(result => {
        return {
          _id: result._id,
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          request: {
            method: "GET",
            url: "http://" + req.hostname + ":3000/products/" + result._id
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

module.exports.products_create_product = async (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  try {
    const savedProduct = await product.save();
    console.log(savedProduct);
    res.status(201).json({
      message: "Product Created...",
      productDetails: savedProduct,
      request: {
        method: "GET",
        message: "See all products...",
        url: "http://" + req.hostname + ":3000/products"
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports.products_get_product = async (req, res, next) => {
  try {
    const result = await Product.findById({ _id: req.params.productID }).select(
      "price name _id productImage"
    );
    res.status(200).json({
      message: "Successfuly fetched...",
      productDetails: result,
      request: {
        method: "GET",
        message: "See all products...",
        url: "http://" + req.hostname + ":3000/products"
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports.products_update_product = async (req, res, next) => {
  const id = req.params.productID;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  try {
    const result = await Product.update({ _id: id }, { $set: updateOps });
    res.status(200).json({
      message: "Product Updated...",
      productDetails: result
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports.products_delete_product = async (req, res, next) => {
  try {
    const result = await Product.findOneAndDelete({
      _id: req.params.productID
    }).select("price name _id");
    console.log(result);
    res.status(200).json({
      message: "Product Deleted...",
      productDetails: result,
      request: {
        method: "GET",
        message: "See all products...",
        url: "http://" + req.hostname + ":3000/products"
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message
    });
  }
};
