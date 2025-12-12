import { getRedisClient } from '@/config';
import type { Conversation } from '@/models/conversation.model';

const CACHE_PREFIX = 'conversation:';
const CACHE_TTL_SECONDS = 60;

const serialize = (conversation: Conversation): string => {
  return JSON.stringify({
    ...conversation,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  });
};

const deserialize = (raw: string): Conversation => {
  return JSON.parse(raw) as Conversation;
};

export const conversationCache = {
  async get(conversationId: string): Promise<Conversation | null> {
    const redis = getRedisClient();
    const payload = await redis.get(`${CACHE_PREFIX}${conversationId}`);
    return payload ? deserialize(payload) : null;
  },

  async set(conversation: Conversation): Promise<void> {
    const redis = getRedisClient();
    await redis.setex(
      `${CACHE_PREFIX}${conversation._id}`,
      CACHE_TTL_SECONDS,
      serialize(conversation),
    );
  },

  async delete(conversationId: string): Promise<void> {
    const redis = getRedisClient();
    await redis.del(`${CACHE_PREFIX}${conversationId}`);
  },
};
