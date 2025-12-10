import { Router } from 'express';
import { authRouter } from '@/routes/auth.routes';
import { usersRouter } from '@/routes/users.routes';

const gatewayRouter: Router = Router();

gatewayRouter.use('/auth', authRouter);
gatewayRouter.use('/users', usersRouter);

export default gatewayRouter;
