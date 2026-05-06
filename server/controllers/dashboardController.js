const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

exports.getStats = async (req, res) => {
  try {
    const [salesResult, totalProducts, totalCustomers] = await Promise.all([
      Sale.aggregate([{ $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
      Product.countDocuments(),
      Customer.countDocuments(),
    ]);

    res.json({
      totalSalesAmount: salesResult[0]?.total || 0,
      totalSalesCount: salesResult[0]?.count || 0,
      totalProducts,
      totalCustomers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
