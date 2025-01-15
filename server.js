import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import models from "./models/index.js";
import Jwt from "@hapi/jwt";
import routes from "./routes/index.js";

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
  });

  // Database sync
  await models.sequelize.sync();

  // Add routes (placeholder for now)
  server.route({
    method: "GET",
    path: "/",
    options: {
      auth: false,
    },
    handler: () => ({ message: "Inventario API is running!" }),
  });

  // Start the server

  server.route(routes);

  await server.register(Jwt);

  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET, // Secret key from .env
    verify: { aud: false, iss: false, sub: false }, // Adjust as needed
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
          role: artifacts.decoded.payload.role,
        },
      };
    },
  });
  server.auth.default("jwt");
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
