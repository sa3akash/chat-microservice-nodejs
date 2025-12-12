import { env } from '@/config';
import { Message, USER_ID_HEADER, type CreateConversationInput } from '@chat/common';
import axios from 'axios';
import { authHeader } from '@/services/auth.proxy.service';

const client = axios.create({
  baseURL: env.CHAT_SERVICE_URL,
  timeout: 5000,
});

export interface ConversationDto {
  id: string;
  title: string | null;
  participantIds: string[];
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
}

export class ChatProxyService {
  public async createConversation(
    userId: string,
    payload: CreateConversationInput,
  ): Promise<ConversationDto> {
    const response = await client.post<ConversationDto>(`/chat/create-conversation`, payload, {
      headers: {
        ...authHeader.headers,
        [USER_ID_HEADER]: userId,
      },
    });
    return response.data;
  }

  public async getConversationById(id: string, userId: string): Promise<ConversationDto> {
    const response = await client.get<ConversationDto>(`/chat/get-conversation/${id}`, {
      headers: {
        ...authHeader.headers,
        [USER_ID_HEADER]: userId,
      },
    });
    return response.data;
  }

  public async listConversations(
    userId: string,
    query: { participantId?: string },
  ): Promise<ConversationDto[]> {
    const response = await client.get<ConversationDto[]>(
      `/chat/list-conversations?participantId=${query.participantId}`,
      {
        headers: {
          ...authHeader.headers,
          [USER_ID_HEADER]: userId,
        },
      },
    );
    return response.data;
  }

  public async createMessage(
    conversationId: string,
    userId: string,
    payload: { body: string },
  ): Promise<Message> {
    const response = await client.post<Message>(`/chat/create-message/${conversationId}`, payload, {
      headers: {
        ...authHeader.headers,
        [USER_ID_HEADER]: userId,
      },
    });
    return response.data;
  }

  public async listMessages(
    conversationId: string,
    userId: string,
    query: string,
  ): Promise<Message[]> {
    const response = await client.get<Message[]>(`/chat/list-messages/${conversationId}?${query}`, {
      headers: {
        ...authHeader.headers,
        [USER_ID_HEADER]: userId,
      },
    });

    return response.data;
  }
}
