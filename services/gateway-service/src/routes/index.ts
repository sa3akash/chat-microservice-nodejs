import { Router } from 'express';
import { authRouter } from '@/routes/auth.routes';

const gatewayRouter: Router = Router();

gatewayRouter.use('/auth', authRouter);

export default gatewayRouter;
