import models from "../models/index.js";
import { checkRole } from "../utils/checkRole.js";

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
    options: {
      pre: [checkRole("manager")],
    },
    handler: async (request, h) => {
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
    options: {
      pre: [checkRole("manager")],
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const { name } = request.payload;
      const location = await models.Location.findByPk(id);

      if (!location) {
        return h
          .response({ error: "I have no idea where that place is sir" })
          .code(404);
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
    options: {
      pre: [checkRole("manager")],
    },
    handler: async (request, h) => {
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
