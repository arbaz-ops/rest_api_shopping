const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");

dotenv.config();

module.exports.user_sigup = async (req, res, next) => {
  try {
    await User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          res.status(409).json({
            message: "Email Already Exists..."
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              console.log(err.message);
              res.status(500).json({
                error: err.message
              });
            } else {
              console.log(hash);
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
              });
              user.save((err, result) => {
                if (err) {
                  console.log(err.message);
                  res.status(500).json({
                    error: err.message
                  });
                } else {
                  res.status(201).json({
                    message: "User Created..."
                  });
                }
              });
            }
          });
        }
      })
      .catch(err => {
        console.log(err.message);
        res.status(500).json({
          error: err.message
        });
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports.user_login = async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length < 1) {
      res.status(404).json({
        message: "Auth Failed..."
      });
    } else {
      const validPass = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (!validPass) {
        res.status(404).json({
          message: "Auth Failed..."
        });
      } else {
        const token = jwt.sign(
          {
            email: user[0].email,
            _id: user[0]._id
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h"
          }
        );
        console.log(token);
        res.status(200).json({
          message: "Auth successful...",
          token: token
        });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports.delete_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
