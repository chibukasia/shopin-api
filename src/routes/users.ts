import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/users-controller";

const router = Router()

router.get('/', getAllUsers)

router.post('/', createUser)

router.get('/:id', getUser)

router.patch('/:id', updateUser)

router.delete('/:id', deleteUser)

export default router