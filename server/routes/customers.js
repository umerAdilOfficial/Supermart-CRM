const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomerProfile,
  createCustomer,
  updateCustomer,
  findByPhone,
  deleteCustomer,
} = require("../controllers/customerController");

router.get("/", getCustomers);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.get("/:id/profile", getCustomerProfile);
router.get("/phone/:phone", findByPhone);

module.exports = router;
