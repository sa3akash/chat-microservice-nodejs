import { auth } from '@/decorators';
import { conversationService } from '@/services/conversation.services';
import { messageService } from '@/services/message.services';
import {
  BadRequestError,
  conversationIdParamsSchema,
  createConversationSchema,
  createMessageBodySchema,
  listConversationsQuerySchema,
  listMessagesQuerySchema,
  Validate,
} from '@chat/common';
import type { Request, Response } from 'express';

export class ConversationController {
  @Validate({
    body: createConversationSchema,
  })
  @auth()
  public async createConversation(req: Request, res: Response) {
    const user = req.user;
    const payload = req.body;
    const uniqueParticipantIds = Array.from(new Set([...payload.participantIds, user.id]));

    if (uniqueParticipantIds.length < 2) {
      throw new BadRequestError('Conversation must atleast include one other participant');
    }

    const conversation = await conversationService.createConversation({
      title: payload.title,
      participantIds: uniqueParticipantIds,
    });
    res.status(201).json({ data: conversation });
  }

  @Validate({
    query: listConversationsQuerySchema,
  })
  @auth()
  public async listConversations(req: Request, res: Response) {
    const user = req.user;
    const filter = req.query;
    if (filter.participantId && filter.participantId !== user.id) {
      throw new BadRequestError('Unauthorized');
    }

    const conversations = await conversationService.listConversation({ participantId: user.id });
    res.status(201).json({ data: conversations });
  }

  @Validate({
    params: conversationIdParamsSchema,
  })
  @auth()
  public async getConversationById(req: Request, res: Response) {
    const user = req.user;
    const conversationId = req.params.id;
    const conversation = await conversationService.getConversationById(conversationId);

    if (!conversation.participantIds.includes(user.id)) {
      throw new BadRequestError('Unauthorized');
    }

    res.status(200).json({ data: conversation });
  }

  @Validate({
    params: conversationIdParamsSchema,
    body: createMessageBodySchema,
  })
  @auth()
  public async createMessage(req: Request, res: Response) {
    const user = req.user;
    const payload = req.body;
    const conversationId = req.params.id;
    const message = await messageService.createMessage(conversationId, user.id, payload.body);
    res.status(201).json({ data: message });
  }

  @Validate({
    params: conversationIdParamsSchema,
    query: listMessagesQuerySchema,
  })
  @auth()
  public async listMessages(req: Request, res: Response) {
    const user = req.user;
    const conversationId = req.params.id;
    const query = req.query;
    const after = query.after ? new Date((query.after as string) ?? '') : undefined;
    const messages = await messageService.listMessages(conversationId, user.id, {
      limit: Number(query.limit ?? 0),
      after,
    });
    res.json({ data: messages });
  }
}
