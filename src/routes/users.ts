import { Router } from 'express'
import authMiddleware from '../middlewares/auth'
import { errorHandler } from '../error-handler'
import {
  addAddress,
  changeUserRole,
  deleteAddress,
  getUserById,
  listAddress,
  listUsers,
  updateUser,
} from '../controllers/users'

const usersRoutes: Router = Router()

usersRoutes.post('/', [authMiddleware], errorHandler(addAddress))
usersRoutes.get('/', [authMiddleware], errorHandler(listAddress))
usersRoutes.delete('/:id', [authMiddleware], errorHandler(deleteAddress))
usersRoutes.put('/', [authMiddleware], errorHandler(updateUser))

usersRoutes.get('/users', [authMiddleware], errorHandler(listUsers))
usersRoutes.get('/users/:id', [authMiddleware], errorHandler(getUserById))
usersRoutes.put('/users/:id', [authMiddleware], errorHandler(changeUserRole))

export default usersRoutes
