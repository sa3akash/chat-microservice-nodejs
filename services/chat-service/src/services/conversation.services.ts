import { conversationCache } from '@/cache/conversation.cache';
import { type Conversation, conversationModel } from '@/models/conversation.model';
import { type ConversationFilter, NotFoundError, type CreateConversationInput } from '@chat/common';

class ConversationService {
  public async createConversation(input: CreateConversationInput) {
    const conversation = await conversationModel.create(input);
    await conversationCache.set(conversation.toObject());
    return conversation;
  }

  async getConversationById(id: string): Promise<Conversation> {
    const cached = await conversationCache.get(id);
    if (cached) {
      return cached;
    }

    const conversation = await conversationModel.findById(id);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    await conversationCache.set(conversation.toObject());
    return conversation;
  }

  async listConversation(filter: ConversationFilter): Promise<Conversation[]> {
    return conversationModel
      .find({ participantIds: filter.participantId })
      .sort({ lastMessageAt: -1, updatedAt: -1 });
  }

  async touchConversation(conversationId: string, preview: string): Promise<void> {
    await conversationModel.updateOne(
      { _id: conversationId },
      {
        $set: {
          lastMessageAt: new Date(),
          lastMessagePreview: preview,
          updatedAt: new Date(),
        },
      },
    );
    await conversationCache.delete(conversationId);
  }
}

export const conversationService = new ConversationService();
