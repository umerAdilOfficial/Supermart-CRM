const Customer = require("../models/Customer");
const Sale = require("../models/Sale");

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCustomerProfile = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findById(customerId);

    const sales = await Sale.find({ customer: customerId }).sort({
      createdAt: -1,
    });

    const totalSpent = sales.reduce((sum, s) => sum + s.total, 0);

    const lastPurchase = sales[0]?.createdAt || null;

    res.json({
      customerName: customer?.name,
      totalSpent,
      totalOrders: sales.length,
      averageOrder: sales.length ? totalSpent / sales.length : 0,
      lastPurchase,
      sales,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findByPhone = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      phone: req.params.phone,
    });

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
