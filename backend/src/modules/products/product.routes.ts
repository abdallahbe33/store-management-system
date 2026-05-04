import { Router } from "express";
import { Role } from "@prisma/client";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import validate from "../../middleware/validate.middleware";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "./product.controller";
import {
  createProductSchema,
  updateProductSchema,
} from "./product.validation";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getAllProductsController)
  .post(
    restrictTo(Role.ADMIN, Role.MANAGER),
    validate(createProductSchema),
    createProductController
  );

router
  .route("/:id")
  .get(getProductByIdController)
  .patch(
    restrictTo(Role.ADMIN, Role.MANAGER),
    validate(updateProductSchema),
    updateProductController
  )
  .delete(restrictTo(Role.ADMIN, Role.MANAGER), deleteProductController);

export default router;