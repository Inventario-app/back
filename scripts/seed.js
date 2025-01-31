import models from "../models/index.js"; // Import Sequelize models
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const DB_NAME = process.env.DB_NAME;
async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  console.log(`Database '${DB_NAME}' ensured.`);
  await connection.end();
}

const seedDatabase = async () => {
  try {
    await ensureDatabaseExists();
    // Sync the database
    await models.sequelize.sync({ force: true }); // Drops tables if they already exist

    console.log("Database synced!");

    // Create locations
    const locations = await models.Location.bulkCreate([
      { name: "Hell's Kitchen" },
      { name: "Brooklyn" },
      { name: "Queens" },
    ]);

    console.log("Locations created!");

    const [adminUser, created] = await models.User.findOrCreate({
      where: {
        userName: "admin",
      },
      defaults: {
        userName: "admin",
        email: "admin@admin.com",
        password: "admin", // Plain password
        role: "manager",
      },
    });

    if (created) {
      console.log("Admin created:", adminUser);
    } else {
      console.log("Admin already exists:", adminUser);
    }

    // Create additional users
    // Create users
    const usersData = [
      {
        userName: "John Wick",
        email: "john@wick.com",
        password: "wickerman123",
        role: "manager",
        locationId: locations[0].id,
      },
      {
        userName: "Jane Banana",
        email: "jane@banana.com",
        password: "banana123",
        role: "staff",
        locationId: locations[1].id,
      },
    ];
    let createdUsers = [];
    for (const user of usersData) {
      const [userRecord, created] = await models.User.findOrCreate({
        where: {
          email: user.email,
        },
        defaults: {
          userName: user.userName,
          email: user.email,
          password: user.password, // Plain password
          role: user.role,
          locationId: user.locationId,
        },
      });

      if (created) {
        createdUsers.push(userRecord.id);
        console.log(`User created: ${userRecord.userName}`);
      } else {
        console.log(`User already exists: ${userRecord.userName}`);
      }
    }
    console.log(createdUsers);

    console.log("Users created!");

    // Create items
    const items = await models.Item.bulkCreate([
      {
        name: "Tomatoes",
        description: "Fresh red tomatoes",
        totalQuantity: 30,
      },
      {
        name: "Chicken",
        description: "Frozen chicken breasts",
        totalQuantity: 35,
      },
      { name: "Flour", description: "All-purpose flour", totalQuantity: 100 },
    ]);

    console.log("Items created!");

    // Create item-location relationships
    await models.ItemLocation.bulkCreate([
      { itemId: items[0].id, locationId: locations[0].id, quantity: 30 }, // 50 Tomatoes in Main Kitchen
      { itemId: items[1].id, locationId: locations[2].id, quantity: 35 }, // 30 Chicken in Freezer
      { itemId: items[2].id, locationId: locations[1].id, quantity: 100 }, // 100 Flour in Pantry
    ]);

    console.log("Item-location relationships created!");

    // Create transactions
    await models.Transaction.bulkCreate([
      {
        itemId: items[0].id,
        userId: createdUsers[0],
        locationId: locations[0].id,
        quantityChanged: 10,
        transactionType: "remove", // Manager took 10 Tomatoes
      },
      {
        itemId: items[1].id,
        userId: createdUsers[1],
        locationId: locations[2].id,
        quantityChanged: 5,
        transactionType: "add", // Staff added 5 Chicken
      },
    ]);

    console.log("Transactions created!");

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating the database:", error);
  } finally {
    await models.sequelize.close(); // Close the database connection
    console.log("Database connection closed.");
  }
};

seedDatabase();
