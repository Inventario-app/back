import { Sequelize } from "sequelize";
import sequelize from "../config/config.js";

// Import models
import User from "./User.js";
import Location from "./Location.js";
import Item from "./Item.js";
import ItemLocation from "./ItemLocation.js";
import Transaction from "./Transaction.js";

// Define relationships

// User ↔ Location (One-to-Many)
User.belongsTo(Location, { foreignKey: "locationId", as: "location" });
Location.hasMany(User, { foreignKey: "locationId", as: "users" });

// Item ↔ Location (Many-to-Many via ItemLocation)
Item.belongsToMany(Location, {
  through: ItemLocation,
  foreignKey: "itemId",
  as: "locations",
});
Location.belongsToMany(Item, {
  through: ItemLocation,
  foreignKey: "locationId",
  as: "items",
});

// Transaction relationships
Transaction.belongsTo(User, { foreignKey: "userId", as: "user" }); // User who made the transaction
Transaction.belongsTo(Location, { foreignKey: "locationId", as: "location" }); // Location where the transaction occurred
Transaction.belongsTo(Item, { foreignKey: "itemId", as: "item" }); // Item involved in the transaction

// Export all models and sequelize instance
const models = {
  User,
  Location,
  Item,
  ItemLocation,
  Transaction,
  sequelize,
};

export default models;
