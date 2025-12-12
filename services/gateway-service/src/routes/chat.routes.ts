import { ChatController } from '@/controllers/chat.controller';
import { Router } from 'express';

const chatRouter: Router = Router();

chatRouter.post('/conversation', ChatController.prototype.createConversation);
chatRouter.get('/conversation/:id', ChatController.prototype.getConversationById);
chatRouter.get('/conversations', ChatController.prototype.listConversations);
chatRouter.get('/messages/:id', ChatController.prototype.listMessages);
chatRouter.post('/message/:id', ChatController.prototype.createMessage);

export { chatRouter };
