import { Router } from "express";
import { Role } from "@prisma/client";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import validate from "../../middleware/validate.middleware";
import {
  addStockController,
  adjustStockController,
  getAllStockMovementsController,
  getProductStockMovementsController,
  removeStockController,
  returnStockController,
} from "./stock.controller";
import {
  stockAdjustmentSchema,
  stockMovementSchema,
} from "./stock.validation";

const router = Router();

router.use(protect);

router.get(
  "/movements",
  restrictTo(Role.ADMIN, Role.MANAGER),
  getAllStockMovementsController
);

router.get(
  "/products/:id/movements",
  restrictTo(Role.ADMIN, Role.MANAGER),
  getProductStockMovementsController
);

router.post(
  "/in",
  restrictTo(Role.ADMIN, Role.MANAGER),
  validate(stockMovementSchema),
  addStockController
);

router.post(
  "/out",
  restrictTo(Role.ADMIN, Role.MANAGER),
  validate(stockMovementSchema),
  removeStockController
);

router.post(
  "/return",
  restrictTo(Role.ADMIN, Role.MANAGER),
  validate(stockMovementSchema),
  returnStockController
);

router.post(
  "/adjust",
  restrictTo(Role.ADMIN, Role.MANAGER),
  validate(stockAdjustmentSchema),
  adjustStockController
);

export default router;