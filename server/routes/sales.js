const express = require("express");
const router = express.Router();
const {
  getSales,
  createSale,
  getTopCustomers,
  getDashboard,
} = require("../controllers/saleController");

router.get("/", getSales);
router.post("/", createSale);
router.get("/top-customers", getTopCustomers);
router.get("/dashboard", getDashboard);

module.exports = router;
