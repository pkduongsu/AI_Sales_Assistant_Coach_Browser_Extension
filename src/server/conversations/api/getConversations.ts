// src/features/conversations/api/getConversation.ts
import { supabase } from '@/lib/supabase';
import type { ConversationRow } from './types';

export async function getConversation(threadId: string): Promise<ConversationRow | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select('thread_id,page_id,psid,display_name,summary,updated_at,conversation_status')
    .eq('thread_id', threadId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // not-found
  return data ?? null;
}
