const express = require("express");
const { db, Customer, Order, Product } = require("./db");

const ordersRouter = require("./routes/orders");
const productsRouter = require("./routes/products");
const customersRouter = require("./routes/customers");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Express Lab 3 - E-commerce API",
    endpoints: {
      customers: "GET /api/customers",
      products: "GET /api/products", 
      orders: "GET /api/orders"
    }
  });
});

app.use(express.json());
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/customers", customersRouter);


const init = async () => {
  try {
    await db.sync({ force: true });

    // Seed test data
    const [customer] = await Promise.all([
      Customer.create({ name: "Test User", email: "test@example.com" }),
      Product.bulkCreate([
        { name: "Wireless Mouse", price: 29.99, stock: 50 },
        { name: "Mechanical Keyboard", price: 89.99, stock: 25 },
      ]),
    ]);

    const order = await Order.create({ status: "pending" });
    await customer.addOrder(order);
    await order.addProducts([1, 2]);

    console.log("Database seeded!");
    app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
  } catch (error) {
    console.error("Error initializing:", error);
  }
};

init();
