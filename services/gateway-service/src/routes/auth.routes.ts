import { AuthController } from '@/controllers/auth.controller';
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.post('/register', AuthController.prototype.register);

export { authRouter };
