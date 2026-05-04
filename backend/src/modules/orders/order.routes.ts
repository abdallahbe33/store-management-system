import { Router } from "express";
import { Role } from "@prisma/client";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import validate from "../../middleware/validate.middleware";
import {
  createOrderController,
  deleteOrderController,
  getAllOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
} from "./order.controller";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "./order.validation";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo(Role.ADMIN, Role.MANAGER), getAllOrdersController)
  .post(createOrderController);

router
  .route("/:id")
  .get(getOrderByIdController)
  .delete(restrictTo(Role.ADMIN, Role.MANAGER), deleteOrderController);

router.patch(
  "/:id/status",
  restrictTo(Role.ADMIN, Role.MANAGER),
  validate(updateOrderStatusSchema),
  updateOrderStatusController
);

export default router;