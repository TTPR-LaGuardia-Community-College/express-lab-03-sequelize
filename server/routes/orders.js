const express = require('express');
const router = express.Router();
// Add OrderProduct to imports
const { Order, Product, Customer, OrderProduct } = require("../db");

/* =========================================================================
   GET /api/orders/:id
   -------------------------------------------------------------------------
   Return a single order, its customer, and its products.
   ========================================================================= */
router.get("/:id", async (req, res, next) => {
  try {
    /* Implementation Steps:
       1. Find order by primary key (req.params.id)
       2. Include Customer and Products (through table)
       3. If not found → 404 JSON { error: "Order not found" }
       4. Calculate total price (sum of line items)
       5. Return order JSON + total
    */

    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Customer },
        { model: Product }
      ]

    });

    console.log(JSON.stringify(Product, null, 2))
    console.log(JSON.stringify(order, null, 2))

    const total = order.products.reduce((sum, product) => {
      return sum + parseFloat(product.price);
    }, 0);

    console.log(total); // Output: 119.98

    // let total = 0;
    // ...calculate total here...
    res.json({ ...order.toJSON(), total });
  } catch (error) {
    next(error);
  }
});
router.post('/', async (req, res, next) => {
  try {
    const { customerId, products } = req.body;

    // Validate customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({
        message: `Customer with id ${customerId} not found`
      });
    }

    // Validate products exist
    const productIds = products.map(p => p.id);
    const existingProducts = await Product.findAll({
      where: { id: productIds }
    });
    if (existingProducts.length !== products.length) {
      return res.status(404).json({
        message: 'One or more products not found'
      });
    }

    // Create order
    const newOrder = await Order.create({
      customerId,
      status: 'pending'
    });

    // Add products
    for (const item of products) {
      await newOrder.addProduct(item.id, {
        through: { quantity: item.qty }
      });
    }

    // Return complete order
    const completeOrder = await Order.findByPk(newOrder.id, {
      include: [
        { model: Customer },
        { model: Product, through: { attributes: ['quantity'] } }
      ]
    });


    res.status(201).json(completeOrder);
  } catch (error) {
    next(error);
  }
});
/* --------------------------------------------------------------------------
   TODO: Add the rest of the CRUD routes

   - GET /api/orders          → list all orders (+ eager‑loaded data)
   - POST /api/orders         → create new order (validate body)
   - PUT  /api/orders/:id     → update order (status, products, etc.)
   - DELETE /api/orders/:id   → delete order
-------------------------------------------------------------------------- */

module.exports = router;
