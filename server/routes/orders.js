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
    const order = await Order.findByPk(req.params.id, {
      include: [
        Customer,
        Product
      ]
    });
    if (!order) {
      return res.status(404).json({error:"Order not found"})
    }
    let total = 0;
    if (order.products) {
      total = order.products.reduce((sum, product) => {
        const quantity = product.Orderproducts?.quantity || 1;
        return sum + (parseFloat(product.price)*quantity);
      }, 0);
    }
    res.json({ ...order.toJSON(), total: parseFloat(total.toFixed(2)) });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { customerId, products } = req.body;
    
    // Validate required fields
    if (!customerId || !products || !Array.isArray(products)) {
      return res.status(400).json({ 
        error: "Missing required fields: customerId and products array are required" 
      });
    }
    
    // Verify customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    // Create the order
    const order = await Order.create({ 
      customerId,
      status: "pending" 
    });
    
    // Add products to order with quantities
    for (const productItem of products) {
      const product = await Product.findByPk(productItem.id);
      if (product) {
        await order.addProduct(product, { 
          through: { quantity: productItem.qty || 1 } 
        });
      }
    }
    
    // Fetch the complete order with products for response
    const completeOrder = await Order.findByPk(order.id, {
      include: [Product]
    });
    
    // Calculate total
    let total = 0;
    if (completeOrder.products) {
      total = completeOrder.products.reduce((sum, product) => {
        const quantity = product.OrderProducts?.quantity || 1;
        return sum + (parseFloat(product.price) * quantity);
      }, 0);
    }
    
    res.status(201).json({ 
      ...completeOrder.toJSON(), 
      total: parseFloat(total.toFixed(2)) 
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: "Validation error", 
        details: error.errors.map(e => e.message) 
      });
    }
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
