/**
 * Aggregates the Sequelize instance + models + their relationships
 * so the rest of the project can simply `require("./db")`.
 */

const { DataTypes } = require("sequelize");
const db       = require("./db");           // ← your Sequelize instance
const Customer = require("./models/Customer");
const Order    = require("./models/Order");
const Product  = require("./models/Product");


const OrderProduct = db.define("OrderProducts", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

/* ──────────────────────────────────────────────────────────────
   Associations
────────────────────────────────────────────────────────────── */
// 1-to-Many  (Customer → Order)
Customer.hasMany(Order);
Order.belongsTo(Customer);

// Many-to-Many  (Order ↔ Product)
Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

/* ──────────────────────────────────────────────────────────────
   Export everything any route might need
────────────────────────────────────────────────────────────── */
module.exports = { db, Customer, Order, Product, OrderProduct };
