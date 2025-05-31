const router = require("express").Router();
const { Product } = require("../db");

/* =========================================================================
   GET /api/products
   -------------------------------------------------------------------------
   Return all products.
   ========================================================================= */
router.get("/", async (_req, res, next) => {
  try {
    /* Implementation Steps:
       1. Fetch all products
       2. Return JSON array
    */
  const products = await Product.findAll();
  res.json(products);
  } catch (error) {
    next(error);
  }
});

/* =========================================================================
   GET /api/products/:id
   ========================================================================= */
router.get("/:id", async (req, res, next) => {
  try {
    /* Implementation Steps:
       1. Find product by PK
       2. 404 if not found
       3. Return product JSON
    */
  const product = await Product.findByPk(req.params.id);
    
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);

  } catch (error) {
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
    /* Implementation Steps:
       1. Validate required fields (name, price)
       2. Create product
       3. Return 201 + created product
       4. 400 on validation errors
    */
  const { name, price, stock } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({
      error: "Missing required fields: name and price are required"
    })
  }
  const product = await Product.create({ name, price, stock});
  res.status(201).json(product);
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

/* =========================================================================
   PUT /api/products/:id
   ========================================================================= */
router.put("/:id", async (req, res, next) => {
  try {
    /* Implementation Steps:
       1. Find product by PK
       2. 404 if not found
       3. Update with partial body
       4. Return updated JSON
    */
    const product = await Product.findByPk(req.params.id);
    
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  const updatedProduct = await product.update(req.body);
  res.json(updatedProduct)
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

/* =========================================================================
   DELETE /api/products/:id
   ========================================================================= */
router.delete("/:id", async (req, res, next) => {
  try {
    /* Implementation Steps:
       1. Destroy product by PK
       2. 404 if not found
       3. Return 204 No Content
    */
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({error: "Product not found"});
  }
  await product.destroy();
  res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
