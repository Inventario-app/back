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

const [location, created] = await Item.findOrCreate({
  where: { name: "Bananas" },
  defaults: { name: "Bananas" },
});

if (created) {
  console.log("Item created:", location);
} else {
  console.log("Item already exists:", location);
}

export default Item;
