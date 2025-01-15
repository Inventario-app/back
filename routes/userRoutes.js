import Sequelize from "sequelize";
import models from "../models/index.js";
import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
export default [
  //Get /users
  {
    method: "GET",
    path: "/users",
    handler: async (request, h) => {
      const userRole = request.auth.credentials.role;
      if (userRole != "manager") {
        return h
          .response({
            message: "Sorry sir your rank in the guild is not prominent enough",
          })
          .code(403); // Forbidden
      }
      const users = await models.User.findAll();
      return h.response(users);
    },
  },
  // Post /users
  {
    method: "POST",
    path: "/users",
    handler: async (request, h) => {
      const userRole = request.auth.credentials.role;
      if (userRole != "manager") {
        return h
          .response({
            message: "Sorry sir your rank in the guild is not prominent enough",
          })
          .code(403); // Forbidden
      }
      const { userName, email, password, role, locationId } = request.payload;
      try {
        const newUser = await models.User.create({
          userName,
          email,
          password,
          role,
          locationId,
        });
        console.log(newUser);
        return h.response(newUser).code(201);
      } catch (error) {
        console.error("Error creating user:", error); // Log the error for debugging
        if (error instanceof Sequelize.UniqueConstraintError) {
          // Return a generic error message
          return h
            .response({
              message:
                "Sorry sir, it seems like you already belong to our guild",
            })
            .code(400);
        }
        return h
          .response({ message: "Failed to create user", error })
          .code(500);
      }
    },
  },

  //POST /login
  {
    method: "POST",
    path: "/login",
    options: {
      auth: false,
    },
    handler: async (request, h) => {
      const { email, password } = request.payload;

      // Find user by email
      const user = await models.User.findOne({ where: { email } });
      if (!user) {
        console.log(
          "Stop there you scoundrel, you do not belong to this guild",
        );
        return h
          .response({
            message: "Invalid credentials",
          })
          .code(401);
      }
      const isPasswordValid = models.User.verifyPassword(
        user.password,
        password,
      );

      if (!isPasswordValid) {
        console.log("Stop there you scoundrel, thats not the password");
        return h.response({ message: "Invalid credentials" }).code(401);
      }

      // Generate JWT token
      const token = Jwt.token.generate(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { ttlSec: 3600 }, // Token expiration time (1 hour)
      );

      return h.response({ token });
    },
  },

  //POST updateUser /users/{id}
  {
    method: "POST",
    path: "/users/{id}",
    handler: async (request, h) => {
      try {
        const userRole = request.auth.credentials.role;

        // Check if the user is a manager
        if (userRole !== "manager") {
          return h
            .response({
              message:
                "Sir, you can not interfere with your fellow guild members",
            })
            .code(403); // Forbidden
        }

        const { id } = request.params; // Extract user ID from route parameters
        console.log(id);
        const { userName, email, password, role, locationId } = request.payload;

        // Find the user to update
        const user = await models.User.findByPk(id);

        if (!user) {
          return h
            .response({
              message: " I don not think I've heard that name around here ",
            })
            .code(404); // Not Found
        }

        // Update user details
        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.password = password || user.password;
        user.role = role || user.role;
        user.locationId = locationId || user.locationId;

        await user.save();

        return h
          .response({ message: "I've changed this member's informations sir " })
          .code(200);
      } catch (error) {
        console.error("Error in handler:", error); // Logs any errors that occur within the try block

        return h
          .response({ message: "Failed to update user", error })
          .code(500);
      }
    },
  },
];
