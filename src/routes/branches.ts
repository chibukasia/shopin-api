import { createBranch, deleteBranch, getAllBranches, getBranchDetails, getStoreBranches, getUserBranches, updateBranch } from "../controllers/branches-controller";
import verifyToken from "../middlewares/authMiddleware";
import { Router } from "express";

const router = Router()

router.get('/', verifyToken, getAllBranches)

router.post('/', verifyToken, createBranch)

router.get('/user-branches', verifyToken, getUserBranches)

router.get('/store-branches/:store_id', verifyToken, getStoreBranches)

router.get('/:id', verifyToken, getBranchDetails)

router.patch('/:id', verifyToken, updateBranch)

router.delete('/:id', verifyToken, deleteBranch)


export default router
