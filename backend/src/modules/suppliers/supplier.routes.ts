import { Router } from "express";
import { Role } from "@prisma/client";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import validate from "../../middleware/validate.middleware";
import {
  createSupplierController,
  deleteSupplierController,
  getAllSuppliersController,
  getSupplierByIdController,
  updateSupplierController,
} from "./supplier.controller";
import {
  createSupplierSchema,
  updateSupplierSchema,
} from "./supplier.validation";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getAllSuppliersController)
  .post(
    restrictTo(Role.ADMIN, Role.MANAGER),
    validate(createSupplierSchema),
    createSupplierController
  );

router
  .route("/:id")
  .get(getSupplierByIdController)
  .patch(
    restrictTo(Role.ADMIN, Role.MANAGER),
    validate(updateSupplierSchema),
    updateSupplierController
  )
  .delete(restrictTo(Role.ADMIN, Role.MANAGER), deleteSupplierController);

export default router;