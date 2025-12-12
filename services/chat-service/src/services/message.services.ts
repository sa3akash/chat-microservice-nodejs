import { messageModel, MessageType } from '@/models/message.model';
import { conversationService } from './conversation.services';
import { MessageListOptions, ServerError } from '@chat/common';

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
    options: MessageListOptions = {},
  ): Promise<MessageType[]> {
    const conversation = await conversationService.getConversationById(conversationId);

    if (!conversation.participantIds.includes(requesterId)) {
      throw new ServerError('Requester is not part of this conversation', 403);
    }

    return messageModel.find({ conversationId }, options);
  }
}

export const messageService = new MessageService();
