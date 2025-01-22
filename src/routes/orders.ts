import { Router } from "express";
import verifyToken from "../middlewares/authMiddleware";
import { getAllOrders, getUserOrders, getOrderDetails, createOrder, updateOrder, } from "../controllers/order_controller";

const router = Router()

router.post('/', verifyToken, createOrder)
router.get('/user-orders', verifyToken, getUserOrders)
router.get('/:branch_id', verifyToken, getAllOrders)
router.get('/:id', verifyToken, getOrderDetails)
router.patch('/:id', verifyToken, updateOrder)

export default router