require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Customer = require("./models/Customer");

const MONGODB_URI = process.env.MONGODB_URI;

const products = [
  { name: "Whole Milk", price: 1.99, stock: 50, category: "Dairy" },
  { name: "White Bread", price: 2.49, stock: 40, category: "Bakery" },
  { name: "Eggs (12pk)", price: 3.99, stock: 30, category: "Dairy" },
  { name: "Orange Juice", price: 3.49, stock: 25, category: "Beverages" },
  { name: "Chicken Breast", price: 7.99, stock: 20, category: "Meat" },
  { name: "Cheddar Cheese", price: 4.99, stock: 35, category: "Dairy" },
  { name: "Pasta", price: 1.49, stock: 60, category: "Dry Goods" },
  { name: "Tomato Sauce", price: 2.29, stock: 45, category: "Canned Goods" },
];

const customers = [
  { name: "Alice Johnson", phone: "555-0101" },
  { name: "Bob Smith", phone: "555-0102" },
  { name: "Carol White", phone: "555-0103" },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  await Customer.deleteMany({});

  await Product.insertMany(products);
  await Customer.insertMany(customers);

  console.log(
    `Seeded ${products.length} products and ${customers.length} customers`,
  );
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
