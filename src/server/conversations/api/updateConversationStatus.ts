import  supabase  from '@/lib/supabase';
import type { ConversationRow } from './types';

export async function updateConversationStatus(
  threadId: string,
  status: ConversationRow['conversation_status']
): Promise<ConversationRow> {
  const { data, error } = await supabase
    .from('conversations')
    .update({
      conversation_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('thread_id', threadId)
    .select('thread_id,page_id,psid,display_name,summary,updated_at,conversation_status')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Conversation not found');

  return data;
}