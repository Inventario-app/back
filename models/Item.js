import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Item = sequelize.define("Item", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Item;
