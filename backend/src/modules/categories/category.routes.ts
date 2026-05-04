import { Router } from "express";
import { Role } from "@prisma/client";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import validate from "../../middleware/validate.middleware";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "./category.controller";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getAllCategoriesController)
  .post(
    restrictTo(Role.ADMIN, Role.MANAGER),
    validate(createCategorySchema),
    createCategoryController
  );

router
  .route("/:id")
  .get(getCategoryByIdController)
  .patch(
    restrictTo(Role.ADMIN, Role.MANAGER),
    validate(updateCategorySchema),
    updateCategoryController
  )
  .delete(restrictTo(Role.ADMIN, Role.MANAGER), deleteCategoryController);

export default router;