const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const saleSchema = new mongoose.Schema(
  {
    items: [saleItemSchema],
    total: { type: Number, required: true, min: 0 },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
