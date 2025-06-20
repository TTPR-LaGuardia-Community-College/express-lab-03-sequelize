/**
 * Creates the Sequelize instance.
 * If DATABASE_URL env var exists we use it (e.g. on Heroku),
 * otherwise fall back to a local Postgres db.
 */

const { Sequelize } = require("sequelize");
require("dotenv").config(); // loads .env into process.env

const db = new Sequelize({
  password: process.env.PG_PASSWORD,
  logging:false,
  dialect:"postgres",
  database: process.env.PG_DATABASE,
  username: "postgres"
})


module.exports = db;
