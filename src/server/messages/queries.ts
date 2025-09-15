// src/features/messages/queries.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { listMessages } from "./api/listMessages";

export function useMessages(threadId: string, opts?: { limit?: number; role?: "user"|"assistant" }) {
  return useInfiniteQuery({
    queryKey: ["messages", threadId, opts?.role, opts?.limit],
    initialPageParam: null as null | { ts: string; mid: string },
    queryFn: ({ pageParam }) =>
      listMessages({ threadId, limit: opts?.limit ?? 30, before: pageParam, role: opts?.role }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.length) return undefined;
      const oldest = lastPage[0]; // because we ordered ASC
      return { ts: oldest.ts, mid: oldest.mid }; // next “before” cursor
    },
    select: (data) => data.pages.flat(), // flatten to a single array for your UI
    staleTime: 15_000,
  });
}
