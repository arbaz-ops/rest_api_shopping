const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");

router.post("/signup", UserController.user_sigup);

router.post("/login", UserController.user_login);

router.delete("/:userID", UserController.delete_user);

module.exports = router;
