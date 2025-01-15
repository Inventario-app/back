import models from "../models/index.js";
import { checkRole } from "../utils/checkRole.js";

export default [
  {
    method: "GET",
    path: "/transactions",
    options: { pre: [checkRole("manager")] },
    handler: async (request, h) => {
      const transactions = await models.Transaction.findAll({
        include: ["user", "location", "item"],
      });
      return h.response(transactions);
    },
  },
  {
    method: "POST",
    path: "/transactions",
    handler: async (request, h) => {
      const userId = request.auth.credentials.id; // Get user ID from JWT
      const { itemId, locationId, quantityChanged, transactionType } =
        request.payload;

      const item = await models.Item.findByPk(itemId);
      if (!item) {
        return h
          .response({ error: "Sire, we've never had that here" })
          .code(404);
      }
      const newTransaction = await models.Transaction.create({
        userId,
        itemId,
        locationId,
        quantityChanged,
        transactionType,
      });
      const [itemLocation, created] = await models.ItemLocation.findOrCreate({
        where: { itemId, locationId },
        defaults: { quantity: 0 },
      });

      // Update the ItemLocation table
      if (transactionType === "add") {
        itemLocation.quantity += quantityChanged;
      } else if (transactionType === "remove") {
        itemLocation.quantity -= quantityChanged;
        if (itemLocation.quantity < 0) {
          itemLocation.quantity = 0; // Reset stock to zero
          await itemLocation.save();
          return h
            .response({
              message: `Sire, we did it,but you are left without ${item.name} at this location.`,
              transaction: newTransaction,
            })
            .code(201);
        }
      }
      await itemLocation.save();

      // Update the totalAmount in the Items table
      if (transactionType === "add") {
        item.totalQuantity += quantityChanged;
      } else if (transactionType === "remove") {
        item.totalQuantity -= quantityChanged;
        if (item.totalQuantity < 0) item.totalQuantity = 0; // Prevent negative stock
      }
      await item.save();

      return h.response(newTransaction).code(201);
    },
  },
];
