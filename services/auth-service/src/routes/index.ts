import { AuthController } from '@/controllers/auth.controller';
import express, { type Router } from 'express';

const authRouter: Router = express.Router();

authRouter.post('/register', AuthController.prototype.register);
authRouter.post('/login', AuthController.prototype.login);
authRouter.post('/logout', AuthController.prototype.logout);
authRouter.post('/refresh-token', AuthController.prototype.refreshToken);
authRouter.post('/remove-refresh-token', AuthController.prototype.removeRefreshToken);

export default authRouter;
