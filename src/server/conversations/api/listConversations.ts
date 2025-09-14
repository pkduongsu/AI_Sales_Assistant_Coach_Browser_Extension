// src/features/conversations/api/listConversations.ts
import { supabase } from '@/lib/supabase';
import type { ConversationRow, ListConversationsParams } from './types';

export async function listConversations({
  pageId,
  status,
  q,
  limit = 25,
  cursor,
}: ListConversationsParams): Promise<ConversationRow[]> {
  let qb = supabase
    .from('conversations')
    .select('thread_id,page_id,psid,display_name,summary,updated_at,conversation_status')
    .order('updated_at', { ascending: false })
    .order('thread_id', { ascending: true }); // tie-breaker for deterministic paging

  if (pageId) qb = qb.eq('page_id', pageId);
  if (status) qb = qb.eq('conversation_status', status);
  if (q && q.trim()) {
    // simple OR search across name + summary
    const term = `%${q.trim()}%`;
    qb = qb.or(`display_name.ilike.${term},summary.ilike.${term}`);
  }

  if (cursor) {
    // keyset: (updated_at, thread_id) < (cursor.updated_at, cursor.thread_id)
    qb = qb.or(
      `and(updated_at.lt.${cursor.updated_at}),and(updated_at.eq.${cursor.updated_at},thread_id.gt.${cursor.thread_id})`
    );
  }

  qb = qb.limit(limit);

  const { data, error } = await qb;
  if (error) throw error;
  return data ?? [];
}
