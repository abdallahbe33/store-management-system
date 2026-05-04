import { Router } from "express";
import { Role } from "@prisma/client";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import {
  getDashboardSummaryController,
  getLowStockProductsController,
  getRecentOrdersController,
  getRecentStockMovementsController,
} from "./dashboard.controller";

const router = Router();

router.use(protect);
router.use(restrictTo(Role.ADMIN, Role.MANAGER));

router.get("/summary", getDashboardSummaryController);
router.get("/low-stock", getLowStockProductsController);
router.get("/recent-orders", getRecentOrdersController);
router.get("/recent-stock-movements", getRecentStockMovementsController);

export default router;