// src/features/conversations/queries.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { qk } from '@/shared/queryKeys';
import { listConversations } from './api/listConversations';
import { getConversation } from './api/getConversations';

export function useConversations(params: {
  pageId?: string;
  status?: 'active' | 'follow up' | 'closed';
  q?: string;
  limit?: number;
}) {
  return useInfiniteQuery({
    queryKey: qk.conversations.list(JSON.stringify(params)),
    queryFn: ({ pageParam }) =>
      listConversations({ ...params, cursor: pageParam ?? null }),
    initialPageParam: null as null | { updated_at: string; thread_id: string },
    getNextPageParam: (lastPage) => {
      if (!lastPage.length) return undefined;
      const last = lastPage[lastPage.length - 1];
      return { updated_at: last.updated_at, thread_id: last.thread_id };
    },
    staleTime: 30_000,
  });
}

export function useConversation(threadId: string) {
  return useQuery({
    queryKey: qk.conversations.byId(threadId),
    queryFn: () => getConversation(threadId),
    enabled: !!threadId,
  });
}
