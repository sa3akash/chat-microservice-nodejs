import { ConversationController } from '@/controllers/conversation.controller';
import express, { type Router } from 'express';

const chatRouter: Router = express.Router();

chatRouter.post('/create-conversation', ConversationController.prototype.createConversation);
chatRouter.get('/list-conversations', ConversationController.prototype.listConversations);
chatRouter.get('/get-conversation/:id', ConversationController.prototype.getConversationById);
chatRouter.post('/create-message', ConversationController.prototype.createMessage);
chatRouter.get('/list-messages', ConversationController.prototype.listMessages);

export default chatRouter;
