import { UsersController } from '@/controllers/users.controller';
import { Router } from 'express';

const usersRouter: Router = Router();

usersRouter.get('/search', UsersController.prototype.searchUsers);
usersRouter.get('/:id', UsersController.prototype.getUser);
usersRouter.get('/', UsersController.prototype.getAllUsers);
usersRouter.post('/', UsersController.prototype.createUser);

export { usersRouter };
