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
      include: [
        {
          model: Order,
          include: [Product]
        }
      ]
    })
    res.json({ ...order.toJSON(), customers })
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
    const customers = await Customer.findByPk(req.params.id, {
      include: [
        { model: Order, include: [Product] }

      ]
    })
    if (!customers) {
      return res.status(404).json({ error: "Customer not found" })
    }
    res.json(customers)

  } catch (error) {
    res.status(404).json({ Customer: "Customer not found" })
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
    const customer = await Customer.create(req.body)
    res.status(201).json(customer)
    /* Implementation Steps:
       1. Validate required fields (name, email)
       2. Create customer
       3. Return 201 + created customer
       4. 400 on validation errors
    */
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ error: err.errors.map(e => e.message) });
    }
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email name already exists" });
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
   const { name } = req.body
   const customerid = await Customer.findByPk(req.params.id)
   await Customer.update({ name }, { where: { id: req.params.id } })
   if(!customerid){
    res.status(404).json({customerid: "not found it "})
   }
  } catch (error) {
    next(error);
  }
});

/* =========================================================================
   DELETE /api/customers/:id
   ========================================================================= */
router.delete("/:id", async (req, res, next) => {
  try {
    const customer = await Product.findByPk(req.params.id)
    if(!customer){
      res.status(404)
    }
    await customer.destroy()
    return res.sendStatus(204)
    /* Implementation Steps:
       1. Destroy product by PK
       2. 404 if not found
       3. Return 204 No Content
    */
  } catch (error) {
    next(error);
  }
});

module.exports = router;
