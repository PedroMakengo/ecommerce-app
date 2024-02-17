import { Router } from 'express'
import authMiddleware from '../middlewares/auth'
import { errorHandler } from '../error-handler'
import { addAddress, deleteAddress, listAddress } from '../controllers/users'

const usersRoutes: Router = Router()

usersRoutes.post('/', [authMiddleware], errorHandler(addAddress))
usersRoutes.get('/', [authMiddleware], errorHandler(listAddress))
usersRoutes.delete('/:id', [authMiddleware], errorHandler(deleteAddress))

export default usersRoutes
