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
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const [location, created] = await Item.findOrCreate({
  where: { name: "Bananas" },
  defaults: { name: "Bananas", description: "is just bananas" },
});

if (created) {
  console.log("Item created:", location);
} else {
  console.log("Item already exists:", location);
}

export default Item;
