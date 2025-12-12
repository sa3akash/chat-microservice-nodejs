import { auth } from '@/decorators';
import { ChatProxyService } from '@/services/chat.proxy.service';
import {
  conversationIdParamsSchema,
  createConversationSchema,
  createMessageBodySchema,
  listConversationsQuerySchema,
  Validate,
} from '@chat/common';
import { Request, Response } from 'express';

const chatProxyService = new ChatProxyService();

export class ChatController {
  @auth()
  @Validate({
    body: createConversationSchema,
  })
  public async createConversation(req: Request, res: Response) {
    const user = req.user;
    const payload = req.body;

    const conversation = await chatProxyService.createConversation(user.id, payload);

    res.status(201).json(conversation);
  }

  @auth()
  @Validate({
    params: conversationIdParamsSchema,
  })
  public async getConversationById(req: Request, res: Response) {
    const user = req.user;
    const conversationId = req.params.id;
    const conversation = await chatProxyService.getConversationById(conversationId, user.id);
    res.status(200).json(conversation);
  }

  @auth()
  @Validate({
    query: listConversationsQuerySchema,
  })
  public async listConversations(req: Request, res: Response) {
    const user = req.user;
    const filter = req.query;

    const conversations = await chatProxyService.listConversations(user.id, {
      participantId: (filter.participantId as string) ?? '',
    });
    res.status(200).json(conversations);
  }

  @auth()
  @Validate({
    params: conversationIdParamsSchema,
    body: createMessageBodySchema,
  })
  public async createMessage(req: Request, res: Response) {
    const user = req.user;
    const { body } = req.body;
    const conversationId = req.params.id;

    const message = await chatProxyService.createMessage(conversationId, user.id, {
      body: body as string,
    });
    res.status(201).json(message);
  }

  @auth()
  @Validate({
    params: conversationIdParamsSchema,
  })
  public async listMessages(req: Request, res: Response) {
    const user = req.user;
    const conversationId = req.params.id;
    const query = req.query;

    const queryParams = new URLSearchParams();
    queryParams.set('limit', query.limit as string);
    queryParams.set('after', query.after as string);

    const messages = await chatProxyService.listMessages(
      conversationId,
      user.id,
      queryParams.toString(),
    );
    res.json(messages);
  }
}
