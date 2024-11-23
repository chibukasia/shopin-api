import { createBranch } from "../controllers/branches-controller";
import verifyToken from "../middlewares/authMiddleware";
import { Router } from "express";

const router = Router()

// router.get('/', verifyToken, )

router.post('/', verifyToken, createBranch)

export default router
