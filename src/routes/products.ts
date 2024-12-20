import {Router} from 'express'
import verifyToken from '../middlewares/authMiddleware'
import { createProduct, deleteProduct, getBranchProducts, getProductDetails, getProductsSummary, getTopSellingProducts, updateProduct } from '../controllers/products-controller'

const router  = Router()

router.post('/', verifyToken, createProduct)
router.get('/:branch_id', verifyToken, getBranchProducts)
router.get('/top-selling-products/', verifyToken, getTopSellingProducts)
router.get('/products-summary', verifyToken, getProductsSummary)

router.get('/:id/', verifyToken, getProductDetails)
router.patch('/:id/', verifyToken, updateProduct)
router.patch('/:id/delete', verifyToken, deleteProduct)


export default router