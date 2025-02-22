import { Router } from "express";
import verifyToken from "../middlewares/authMiddleware";
import {
  createAttributes,
  createProduct,
  createProductCategory,
  deleteManyProducts,
  deleteProduct,
  getBranchProducts,
  getProductDetails,
  getProductsSummary,
  getTopSellingProducts,
  updateProduct,
  updateProductAttributes,
  updateProductCategories,
  updateProductInventory,
  updateProductShipping,
} from "../controllers/products-controller";

const router = Router();

router.post("/branch_id", verifyToken, createProduct);
router.get("/:branch_id", verifyToken, getBranchProducts);
router.get("/top-selling-products/", verifyToken, getTopSellingProducts);
router.get("/products-summary", verifyToken, getProductsSummary);

router.patch("/delete-many", verifyToken, deleteManyProducts);

router.post("/product-categories", verifyToken, createProductCategory);
router.post("/attributes", verifyToken, createAttributes);

router.get("/:id/", verifyToken, getProductDetails);
router.patch("/:id/", verifyToken, updateProduct);
router.patch("/:id/delete", verifyToken, deleteProduct);
router.patch("/:id/inventory", verifyToken, updateProductInventory);
router.patch("/:id/attributes", verifyToken, updateProductAttributes);
router.patch("/:id/shipping", verifyToken, updateProductShipping);
router.patch("/:id/categories", verifyToken, updateProductCategories);

export default router;
