const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

exports.getStats = async (req, res) => {
  try {
    const [salesResult, totalProducts, totalCustomers] = await Promise.all([
      Sale.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
      ]),
      Product.countDocuments(),
      Customer.countDocuments(),
    ]);

    const sales = salesResult[0] || { total: 0, count: 0 };

    const dailySales = await Sale.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalSalesAmount: sales.total,
      totalSalesCount: sales.count,
      totalProducts,
      totalCustomers,
      dailySales,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
