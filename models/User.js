import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";
import pkg from "argon2";
const argon2 = pkg;

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("manager", "staff"),
    defaultValue: "staff",
  },
  locationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
User.beforeCreate(async (user) => {
  const hashed = await argon2.hash(user.password);
  user.password = hashed;
});
User.beforeUpdate(async (user) => {
  const hashed = await argon2.hash(user.password);
  user.password = hashed;
});

User.hashPassword = async function (password) {
  try {
    console.log(password);
    const hash = await argon2.hash(password);
    return console.log(hash);
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
};

User.verifyPassword = async function (storedPassword, inputPassword) {
  try {
    const match = await argon2.verify(storedPassword, inputPassword);
    return match;
  } catch (err) {
    console.error("Error verifying password:", err);
    throw err;
  }
};
const admin = User.build({
  userName: "admin",
  email: "admin@admin.com",
  password: "admin",
  role: "manager",
});

export default User;
