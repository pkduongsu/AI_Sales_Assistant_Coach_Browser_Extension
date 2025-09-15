// src/server/suggestions/queries.ts
import { useQuery } from '@tanstack/react-query';
import { qk } from '@/shared/queryKeys';
import { getSuggestion } from './api/getSuggestion';

export function useSuggestion(threadId: string) {
  return useQuery({
    queryKey: qk.suggestions.byThreadId(threadId),
    queryFn: () => getSuggestion(threadId),
    enabled: !!threadId,
    staleTime: Infinity, // Don't refetch unless manually triggered
    gcTime: 30_000, // Keep in cache for 30 seconds (renamed from cacheTime)
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: false, // Don't refetch when network reconnects
  });
}