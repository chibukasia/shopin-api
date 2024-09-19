import { Router } from "express";
import verifyToken from "../middlewares/authMiddleware";
import { getAllStores, getStoreDetails, createStore, getUserStores, updateStoreDetails } from "../controllers/stores-controller";

const router = Router()

router.get('/', verifyToken, getAllStores)

router.post('/', verifyToken, createStore)

router.get('/user-stores/:id?', verifyToken, getUserStores)

router.get('/:id', verifyToken, getStoreDetails)

router.patch('/:id', verifyToken, updateStoreDetails)

export default router