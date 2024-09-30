import { Router } from "express";
import { loggedinUser, loginUser } from "../controllers/users-controller";
import verifyToken from "../middlewares/authMiddleware";

const router = Router()

router.post('/', loginUser)
router.get('/me/', verifyToken, loggedinUser)

export default router
