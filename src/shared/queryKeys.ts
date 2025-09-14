// src/shared/queryKeys.ts
export const qk = {
  conversations: {
    all: ['conversations'] as const,
    list: (ownerId?: string) => ['conversations', 'list', { ownerId }] as const,
    byId: (id: string) => ['conversations', 'byId', id] as const,
  },
  messages: {
    list: (conversationId: string, cursor?: string) =>
      ['messages', 'list', { conversationId, cursor }] as const,
  },
};
