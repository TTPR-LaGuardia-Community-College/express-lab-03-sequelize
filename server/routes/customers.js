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
  } catch (error) {
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
