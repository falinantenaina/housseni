const { createCategoriesTable } = require("../models/categoryTable");
const { createOrderItemTable } = require("../models/orderItemsTable");
const { createOrdersTable } = require("../models/ordersTable");
const { createPaymentsTable } = require("../models/paymentsTable");
const { createProductReviewsTable } = require("../models/productReviewsTable");
const { createProductsTable } = require("../models/productTable");
const { createShippingInfoTable } = require("../models/shippinginfoTable");
const { createUserTable } = require("../models/userTable");

const createTables = async () => {
  try {
    // L'ordre est important : les tables référencées doivent être créées en premier
    await createUserTable();
    await createCategoriesTable();
    await createProductsTable();
    await createProductReviewsTable();
    await createOrdersTable();
    await createOrderItemTable();
    await createShippingInfoTable();
    await createPaymentsTable();

    console.log("All Tables Created Successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

module.exports = { createTables };
