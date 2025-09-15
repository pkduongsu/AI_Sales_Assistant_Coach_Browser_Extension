// src/shared/queryKeys.ts
export const qk = {
  conversations: {
    all: ['conversations'] as const,
    list: (params?: string) => ['conversations', 'list', params] as const,
    byId: (id: string) => ['conversations', 'byId', id] as const,
  },
  messages: {
    list: (conversationId: string, cursor?: string) =>
      ['messages', 'list', { conversationId, cursor }] as const,
  },
  suggestions: {
    all: ['suggestions'] as const,
    byThreadId: (threadId: string) => ['suggestions', 'byThreadId', threadId] as const,
  },
};
