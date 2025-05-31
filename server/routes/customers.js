const router = require("express").Router();
const { Customer, Order, Product } = require("../db");

/* =========================================================================
   GET /api/customers
   ========================================================================= */
router.get("/", async (_req, res, next) => {
  try {
    /* Implementation Steps:
       1. Fetch all customers
       2. Include Orders (+ Products) for eager‑loading practice
       3. Return JSON array
    */
   const customers = await Customer.findAll({
    include: [{
      model: Order,
      include: [Product]
    }]
   });
   res.json(customers);
  } catch (error) {
    next(error);
  }
});

/* =========================================================================
   GET /api/customers/:id
   ========================================================================= */
router.get("/:id", async (req, res, next) => {
  try {
    /* Implementation Steps:
       1. Find customer by PK
       2. Include Orders (+ Products)
       3. 404 if not found
       4. Return customer JSON
    */
   const customer = await Customer.findByPk(req.params.id, {
    include: [{
      model: Order,
      include: [Product]
    }]
   });
   if (!customer) {
    return res.status(404).json({error: "Customer not found"});
   }
   res.json(customer);
  } catch (error) {
    next(error);
  }
});

/* =========================================================================
   POST /api/customers
   -------------------------------------------------------------------------
   Body: { name, email }
   ========================================================================= */
router.post("/", async (req, res, next) => {
  try {
    /* Implementation Steps:
       1. Validate required fields (name, email)
       2. Create customer
       3. Return 201 + created customer
       4. 400 on validation errors
    */
   const { name, email } = req.body;
   if (!name || !email) {
    return res.status(400).json({
      error: "Missing required fields: name and email are required"
    });
   }
   const customer = await Customer.create({ name, email});
   res.status(201).json(customer);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: "Email already exists"
      });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors.map(e => e.message)
      });
    }
    next(error);
  }
});

/* =========================================================================
   PUT /api/customers/:id
   ========================================================================= */
router.put("/:id", async (req, res, next) => {
  try {
    /* Implementation Steps:
       1. Find customer by PK
       2. 404 if not found
       3. Update fields (partial)
       4. Return updated JSON
    */
  } catch (error) {
    next(error);
  }
});

/* =========================================================================
   DELETE /api/customers/:id
   ========================================================================= */
router.delete("/:id", async (req, res, next) => {
  try {
    /* Implementation Steps:
       1. Destroy customer by PK
       2. 404 if not found
       3. Return 204 No Content
    */
  } catch (error) {
    next(error);
  }
});

module.exports = router;
