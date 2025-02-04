import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/categories-controller";
import verifyToken from "../middlewares/authMiddleware";
const router = Router();

router.get("/", getAllCategories);
router.post("/", verifyToken, createCategory);
router.patch("/:id", verifyToken, updateCategory);
router.delete("/:id" ,verifyToken, deleteCategory);  

export default router;
