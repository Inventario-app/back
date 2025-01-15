import models from "../models/index.js";

export default [
  //GET /locations
  {
    method: "GET",
    path: "/locations",
    handler: async (request, h) => {
      const locations = await models.Location.findAll();
      return h.response(locations);
    },
  },

  //POST /locations
  {
    method: "POST",
    path: "/locations",
    handler: async (request, h) => {
      const userRole = request.auth.credentials.role;
      if (userRole != "manager") {
        return h
          .response({
            message: "Sorry sir your rank in the guild is not prominent enough",
          })
          .code(403); // Forbidden
      }
      const { name } = request.payload;

      const existingLocation = await models.Location.findOne({
        where: { name },
      });

      if (existingLocation) {
        return h.response({ message: "Location already exists" }).code(409); // Conflict
      }
      const newLocation = await models.Location.create({ name });
      return h.response(newLocation).code(201);
    },
  },

  //PUT /locations/{id}
  {
    method: "PUT",
    path: "/locations/{id}",
    handler: async (request, h) => {
      const userRole = request.auth.credentials.role;
      if (userRole != "manager") {
        return h
          .response({
            message: "Sorry sir your rank in the guild is not prominent enough",
          })
          .code(403); // Forbidden
      }

      const { id } = request.params;
      const { name } = request.payload;
      const location = await models.Location.findByPk(id);

      if (!location) {
        return h.response({ error: "Location not found" }).code(404);
      }

      location.name = name;
      await location.save();
      return h.response(location);
    },
  },

  //DELETE /locations/{id}
  {
    method: "DELETE",
    path: "/locations/{id}",
    handler: async (request, h) => {
      const userRole = request.auth.credentials.role;
      if (userRole != "manager") {
        return h
          .response({
            message: "Sorry sir your rank in the guild is not prominent enough",
          })
          .code(403); // Forbidden
      }
      const { id } = request.params;
      const location = await models.Location.findByPk(id);

      if (!location) {
        return h.response({ error: "Location not found" }).code(404);
      }

      await location.destroy();
      return h.response({ message: "Location deleted successfully" });
    },
  },
];
