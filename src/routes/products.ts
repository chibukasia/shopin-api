import {Router} from 'express'
import verifyToken from '../middlewares/authMiddleware'
import { createProduct, deleteManyProducts, deleteProduct, getBranchProducts, getProductDetails, getProductsSummary, getTopSellingProducts, updateProduct } from '../controllers/products-controller'

const router  = Router()

router.post('/branch_id', verifyToken, createProduct)
router.get('/:branch_id', verifyToken, getBranchProducts)
router.get('/top-selling-products/', verifyToken, getTopSellingProducts)
router.get('/products-summary', verifyToken, getProductsSummary)

router.patch('/delete-many', verifyToken, deleteManyProducts)

router.get('/:id/', verifyToken, getProductDetails)
router.patch('/:id/', verifyToken, updateProduct)
router.patch('/:id/delete', verifyToken, deleteProduct)


export default router