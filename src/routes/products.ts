import { Router } from 'express'

import {
  createProduct,
  getProductById,
  listProducts,
  deleteProduct,
  updateProduct,
} from '../controllers/products'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import adminMiddleware from '../middlewares/admin'

const productsRoutes: Router = Router()

productsRoutes.post(
  '/',
  // [authMiddleware, adminMiddleware],
  createProduct
  // errorHandler(createProduct)
)
productsRoutes.put(
  '/:id',
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
)
productsRoutes.delete(
  '/:id',
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
)
productsRoutes.get(
  '/',
  [authMiddleware, adminMiddleware],
  errorHandler(listProducts)
)
productsRoutes.get(
  '/:id',
  [authMiddleware, adminMiddleware],
  errorHandler(getProductById)
)

export default productsRoutes
