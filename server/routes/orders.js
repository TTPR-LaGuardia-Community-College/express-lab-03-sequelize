const router = require("express").Router();
const { Order, Product, Customer } = require("../db");

/* =========================================================================
   GET /api/orders
   -------------------------------------------------------------------------
   List all orders with customer and products (eager-loaded)
   ========================================================================= */
router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.findAll ({
      include: [
        Customer,
        Product
      ]
    });
    const ordersWithTotal = orders.map(order =>{
      const orderJSON = order.toJSON();
      let total = 0;

      if (orderJSON.products) {
        total = orderJSON.products.reduce((sum,products) => {
          const quantity = products.Orderproducts?.quantity || 1;
          return sum + (parseFloat(products.price)*quantity);
        }, 0);
      }
      return {...orderJSON, total: parseFloat(total.toFixed(2))};
    });
  } catch (error) {
    next(error);
  }
});
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
    // const order = await Order.findByPk(...)
    // let total = 0;
    // ...calculate total here...
    // res.json({ ...order.toJSON(), total });
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
