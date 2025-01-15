import userRoutes from "./userRoutes.js";
import locationRoutes from "./locationRoutes.js";
import itemRoutes from "./itemRoutes.js";
import transactionRoutes from "./transactionRoutes.js";

export default [
  ...userRoutes,
  ...locationRoutes,
  ...itemRoutes,
  ...transactionRoutes,
];
