// src/features/conversations/queries.ts
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qk } from '@/shared/queryKeys';
import { listConversations } from './api/listConversations';
import { getConversation } from './api/getConversations';
import { updateConversationStatus } from './api/updateConversationStatus';
import type { ConversationRow } from './api/types';

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

export function useUpdateConversationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId, status }: { threadId: string; status: ConversationRow['conversation_status'] }) =>
      updateConversationStatus(threadId, status),
    onSuccess: (updatedConversation) => {
      // Update the individual conversation cache
      queryClient.setQueryData(
        qk.conversations.byId(updatedConversation.thread_id),
        updatedConversation
      );

      // Invalidate conversations list to refresh with updated status
      queryClient.invalidateQueries({ queryKey: qk.conversations.list() });
    },
  });
}
