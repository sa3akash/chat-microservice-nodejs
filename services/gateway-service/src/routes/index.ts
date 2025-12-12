import { Router } from 'express';
import { authRouter } from '@/routes/auth.routes';
import { usersRouter } from '@/routes/users.routes';
import { chatRouter } from '@/routes/chat.routes';

const gatewayRouter: Router = Router();

gatewayRouter.use('/auth', authRouter);
gatewayRouter.use('/users', usersRouter);
gatewayRouter.use('/chat', chatRouter);

export default gatewayRouter;
