const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", ProductsController.products_get_all_product);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.products_create_product
);

router.get("/:productID", ProductsController.products_get_product);

router.patch(
  "/:productID",
  checkAuth,
  ProductsController.products_update_product
);

router.delete(
  "/:productID",
  checkAuth,
  ProductsController.products_delete_product
);

module.exports = router;
