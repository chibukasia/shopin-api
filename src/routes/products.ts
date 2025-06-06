import { Router } from "express";
import verifyToken from "../middlewares/authMiddleware";
import {
  createAttributes,
  createProduct,
  createProductCategory,
  deleteManyProducts,
  deleteProduct,
  getAttributes,
  getBranchProducts,
  getProductCategories,
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

router.post("/", verifyToken, createProduct);
router.get("/:id/", verifyToken, getProductDetails);

router.get("/branch/:branch_id", verifyToken, getBranchProducts);
router.get("/top-selling-products/", verifyToken, getTopSellingProducts);
router.get("/products-summary", verifyToken, getProductsSummary);

router.patch("/delete-many", verifyToken, deleteManyProducts);

router.post("/product-categories", verifyToken, createProductCategory);
router.post("/attributes", verifyToken, createAttributes);
router.get("/product-categories/:branch_id/", verifyToken, getProductCategories);
router.get("/attributes/:branch_id/", verifyToken, getAttributes);

router.put("/:id/", verifyToken, updateProduct);
router.patch("/:id/delete", verifyToken, deleteProduct);
router.patch("/:id/inventory", verifyToken, updateProductInventory);
router.patch("/:id/attributes", verifyToken, updateProductAttributes);
router.patch("/:id/shipping", verifyToken, updateProductShipping);
router.patch("/:id/categories", verifyToken, updateProductCategories);

export default router;
