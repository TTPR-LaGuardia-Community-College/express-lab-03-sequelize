const router = require("express").Router();
const { Product } = require("../db");

/* =========================================================================
   GET /api/products
   -------------------------------------------------------------------------
   Return all products.
   ========================================================================= */
router.get("/", async (req, res, next) => {
  try {
    /* Implementation Steps:
       1. Fetch all products
       2. Return JSON array
    */
    const products = await Product.findAll()
    res.json(products)
  } catch (error) {
    next(error);
  }
});

/* =========================================================================
   GET /api/products/:id
   ========================================================================= */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await Product.findByPk(id)
    /* Implementation Steps:
       1. Find product by PK
       2. 404 if not found
       3. Return product JSON
    */
   res.json(product)
  } catch (error) {
    res.status(404).json({ error: "product not found"})
    next(error);
  }
});

/* =========================================================================
   POST /api/products
   -------------------------------------------------------------------------
   Body: { name, price, stock }
   ========================================================================= */
router.post("/", async (req, res, next) => {
  try {
      const product = await Product.create(req.body)
      res.status(202).json(product)
      
    /* Implementation Steps:
       1. Validate required fields (name, price)
       2. Create product
       3. Return 201 + created product
       4. 400 on validation errors
    */
  } catch (error) {
        if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ error: err.errors.map(e => e.message) });
    }
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Product name already exists" });
    }
    next(error);
  }
});

/* =========================================================================
   PUT /api/products/:id
   ========================================================================= */
router.put("/:id", async (req, res, next) => {
  try {
      const product = await Product.findByPk(req.params.id)
      if(!product){
        res.status(404)
      }
      await product.update({ "status": "shipped"})
      res.json(product)
    /* Implementation Steps:
       1. Find product by PK
       2. 404 if not found
       3. Update with partial body
       4. Return updated JSON
    */
  } catch (error) {
    next(error);
  }
});

/* =========================================================================
   DELETE /api/products/:id
   ========================================================================= */
router.delete("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if(!product){
      res.status(404)
    }
    await product.destroy()
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
