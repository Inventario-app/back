import models from "../models/index.js";

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
    handler: async (request, h) => {
      const { name, description } = request.payload;
      const newItem = await models.Item.create({ name, description });
      return h.response(newItem).code(201);
    },
  },
  {
    method: "PUT",
    path: "/items/{id}",
    handler: async (request, h) => {
      const { id } = request.params;
      const { name, description } = request.payload;
      const item = await models.Item.findByPk(id);

      if (!item) {
        return h.response({ error: "Item not found" }).code(404);
      }

      item.name = name;
      item.description = description;
      await item.save();
      return h.response(item);
    },
  },
  {
    method: "DELETE",
    path: "/items/{id}",
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
