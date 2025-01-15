import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const ItemLocation = sequelize.define("ItemLocation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default ItemLocation;
