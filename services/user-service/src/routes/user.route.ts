import { UsersController } from '@/controllers/users.controller';
import { Router } from 'express';

const router: Router = Router();

router.post('/', UsersController.prototype.createUser);
router.get('/search', UsersController.prototype.searchUsers);
router.get('/:id', UsersController.prototype.getUserById);
router.get('/', UsersController.prototype.getAllUsers);

export { router };
