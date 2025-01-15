import models from "../models/index.js"; // Import Sequelize models

const deleteDummyData = async () => {
  try {
    // Sync the database (make sure we're in the correct state)
    await models.sequelize.sync();

    console.log("Database synced! Deleting dummy data...");
    await models.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // Truncate all tables in the correct order to avoid foreign key constraints
    await models.Transaction.destroy({ where: {}, truncate: true }); // Deletes all transactions
    console.log("Transactions deleted!");

    await models.ItemLocation.destroy({ where: {}, truncate: true }); // Deletes all item-location relationships
    console.log("Item-location relationships deleted!");

    await models.Item.destroy({ where: {}, truncate: true }); // Deletes all items
    console.log("Items deleted!");

    await models.User.destroy({ where: {}, truncate: true }); // Deletes all users
    console.log("Users deleted!");

    await models.Location.destroy({ where: {}, truncate: true }); // Deletes all locations
    console.log("Locations deleted!");

    console.log("Dummy data deleted successfully!");
  } catch (error) {
    console.error("Error deleting dummy data:", error);
  } finally {
    await models.sequelize.close(); // Close the database connection
    console.log("Database connection closed.");
  }
};

deleteDummyData();
