import models from "../models/index.js";
import { checkRole } from "../utils/checkRole.js";
export default [
  {
    method: "GET",
    path: "/items",
    handler: async (request, h) => {
      const items = await models.Item.findAll({ include: "locations" });
      return h.response(items);
    },
  },
  {
    method: "POST",
    path: "/items",

    options: { pre: [checkRole("manager")] },
    handler: async (request, h) => {
      const { name, description } = request.payload;
      const existingItem = await models.Item.findOne({
        where: { name },
      });
      if (existingItem) {
        return h.response({ message: "Item already exists" }).code(409); // Conflict
      }
      const newItem = await models.Item.create({ name, description });
      return h.response(newItem).code(201);
    },
  },
  {
    method: "PUT",
    path: "/items/{id}",
    options: {
      pre: [checkRole("manager")],
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const { name, description } = request.payload;
      const item = await models.Item.findByPk(id);

      if (!item) {
        return h.response({ error: "Item not found" }).code(404);
      }

      item.name = name || item.name;
      item.description = description || item.description;
      await item.save();
      return h.response(item);
    },
  },
  {
    method: "DELETE",
    path: "/items/{id}",
    options: {
      pre: [checkRole("manager")],
    },
    handler: async (request, h) => {
      const { id } = request.params;
      const item = await models.Item.findByPk(id);

      if (!item) {
        return h.response({ error: "Item not found" }).code(404);
      }

      await item.destroy();
      return h.response({ message: "Item deleted successfully" });
    },
  },
];
