import { Router } from "express";
import { loginUser } from "../controllers/users-controller";

const router = Router()

router.post('/', loginUser)

export default router
