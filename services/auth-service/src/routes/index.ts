import { AuthController } from '@/controllers/auth.controller';
import express, { type Router } from 'express';

const authRouter: Router = express.Router();

authRouter.post('/register', AuthController.prototype.register);
authRouter.post('/login', AuthController.prototype.login);

export default authRouter;
