const express = require("express");
const router = express.Router();
const { getProductByBarcode } = require("../controllers/productController");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const Product = require("../models/Product");

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/barcode/:code", getProductByBarcode);

router.get("/barcode/:code", async (req, res) => {
  try {
    const product = await Product.findOne({
      barcode: req.params.code,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
