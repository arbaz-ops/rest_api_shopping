const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const OrderController = require("../controllers/orders");

router.get("/", OrderController.orders_get_all_order);

router.post("/", checkAuth, OrderController.orders_create_order);

router.get("/:orderID", checkAuth, OrderController.orders_get_order);

router.delete("/:orderID", checkAuth, OrderController.orders_delete_order);

module.exports = router;
