// src/features/conversations/api/types.ts
export type ConversationRow = {
  thread_id: string;
  page_id: string;
  psid: string;
  display_name: string | null;
  summary: string | null;
  updated_at: string; // ISO
  conversation_status: 'active' | 'follow up' | 'closed'; // adjust to your enum
};

// Cursor is based on (updated_at, thread_id) for stable ordering
export type ListConversationsParams = {
  pageId?: string;              // filter by page
  status?: ConversationRow['conversation_status'];
  q?: string;                   // search in display_name or summary
  limit?: number;               // default 25
  cursor?: {                    // load older than this
    updated_at: string;         // ISO
    thread_id: string;
  } | null;
};
