import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, loginUser, updateUser } from "../controllers/users-controller";
import verifyToken from "../middlewares/authMiddleware";

const router = Router()

router.get('/', verifyToken, getAllUsers)

router.post('/', createUser)

router.get('/:id', verifyToken, getUser)

router.patch('/:id', verifyToken, updateUser)

router.delete('/:id', verifyToken, deleteUser)

export default router