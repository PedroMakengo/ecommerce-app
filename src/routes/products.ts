import { Router } from 'express'
import { createProduct } from '../controllers/products'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import adminMiddleware from '../middlewares/admin'

const productsRoutes: Router = Router()

productsRoutes.post(
  '/create',
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
)

export default productsRoutes
