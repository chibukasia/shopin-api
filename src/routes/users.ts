import { Router } from "express";
import { createNewRoleUser, createUser, deleteUser, getAllUsers, getUser, getUserBranchAdmins, loginUser, updateUser } from "../controllers/users-controller";
import verifyToken from "../middlewares/authMiddleware";

const router = Router()

router.get('/', verifyToken, getAllUsers)

router.post('/', createUser)

router.post('/create_user', verifyToken, createNewRoleUser)

router.get('/:id', verifyToken, getUser)

router.patch('/:id', verifyToken, updateUser)

router.delete('/:id', verifyToken, deleteUser)

router.get('/user-branch-admins', verifyToken, getUserBranchAdmins)


export default router