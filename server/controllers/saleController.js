const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customer", "name phone")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const { items, total, name, phone } = req.body;

    let customer = null;

    const cleanPhone = (phone ?? "").toString().trim();

    if (cleanPhone.length > 0) {
      customer = await Customer.findOne({ phone: cleanPhone });

      if (!customer) {
        customer = await Customer.create({
          name: name || "Unknown",
          phone: cleanPhone,
        });
      }
    }

    // STEP 2: update stock
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product ${item.name} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    // STEP 3: create sale (FIXED)
    const sale = await Sale.create({
      items,
      total,

      customer: customer ? customer._id : null,

      customerSnapshot: {
        name: customer ? customer.name : name || null,
        phone: customer ? customer.phone : cleanPhone || null,
      },
    });

    res.status(201).json(sale);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getTopCustomers = async (req, res) => {
  try {
    const data = await Sale.aggregate([
      {
        $group: {
          _id: "$customer",
          totalSpent: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  const totalSales = await Sale.countDocuments();

  const revenue = await Sale.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);

  const topProduct = await Sale.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        qty: { $sum: "$items.quantity" },
      },
    },
    { $sort: { qty: -1 } },
    { $limit: 1 },
  ]);

  res.json({
    totalSales,
    revenue: revenue[0]?.total || 0,
    topProduct,
  });
};

exports.getDashboard = async (req, res) => {
  try {
    const sales = await Sale.find();

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

    const customers = await Customer.countDocuments();
    const products = await Product.countDocuments();

    res.json({
      totalSales,
      totalRevenue,
      totalCustomers: customers,
      totalProducts: products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
