/* eslint-disable @typescript-eslint/no-explicit-any */
import { messageModel, MessageType } from '@/models/message.model';
import { conversationService } from './conversation.services';
import { BadRequestError, ServerError } from '@chat/common';
import { Types } from 'mongoose';

class MessageService {
  async createMessage(
    conversationId: string,
    senderId: string,
    body: string,
  ): Promise<MessageType> {
    // Ensure conversation exists before inserting the message
    const conversation = await conversationService.getConversationById(conversationId);

    if (!conversation.participantIds.includes(senderId)) {
      throw new ServerError('Sender is not part of this conversation', 403);
    }

    const message = await messageModel.create({ conversationId, senderId, body });
    await conversationService.touchConversation(conversationId, body.slice(0, 120));

    return message;
  }

  async listMessages(
    conversationId: string,
    requesterId: string,
    options: { limit: number; after?: string },
  ) {
    const { limit, after } = options;

    const conversation = await conversationService.getConversationById(conversationId);

    if (!conversation.participantIds.includes(requesterId)) {
      throw new ServerError('Requester is not part of this conversation', 403);
    }

    const query: any = { conversationId };

    if (after) {
      if (!Types.ObjectId.isValid(after)) {
        throw new BadRequestError('Invalid cursor id');
      }
      query._id = { $lt: new Types.ObjectId(after) };
    }

    const messages = await messageModel.find(query).sort({ _id: -1 }).limit(limit);

    const nextCursor =
      messages.length === limit ? messages[messages.length - 1]._id.toString() : null;

    return {
      data: messages,
      nextCursor,
    };
  }
}

export const messageService = new MessageService();
