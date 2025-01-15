import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Location = sequelize.define("Location", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});

const [location, created] = await Location.findOrCreate({
  where: { name: "Main Location" },
  defaults: { name: "Main Location" },
});

if (created) {
  console.log("Location created:", location);
} else {
  console.log("Location already exists:", location);
}
export default Location;
