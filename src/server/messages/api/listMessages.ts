// src/features/messages/api/listMessages.ts
import  supabase  from "@/lib/supabase";

export type ListMessagesParams = {
  threadId: string;
  limit?: number;                 // page size
  // Load older messages (scrolling up): return messages with ts < before.ts
  before?: { ts: string; mid: string } | null;
  // Load newer messages (e.g., after reconnect): ts > after.ts
  after?: { ts: string; mid: string } | null;
  role?: "user" | "assistant" ; 
};

export type MessageRow = {
  mid: string;
  thread_id: string;
  role: "user" | "assistant" ;
  text: string;
  ts: string; // ISO
};

export async function listMessages(params: ListMessagesParams): Promise<MessageRow[]> {
  const { threadId, limit = 30, before, after, role } = params;

  let q = supabase
    .from("messages")
    .select("mid,thread_id,role,text,ts")
    .eq("thread_id", threadId);

  if (role) q = q.eq("role", role);

  // Keyset windows:
  // We’ll ORDER BY ts ASC, mid ASC for deterministic ordering within a second.
  if (before) {
    q = q.or(
      `and(ts.lt.${before.ts}),and(ts.eq.${before.ts},mid.lt.${before.mid})`
    );
  } else if (after) {
    q = q.or(
      `and(ts.gt.${after.ts}),and(ts.eq.${after.ts},mid.gt.${after.mid})`
    );
  }

  q = q.order("ts", { ascending: true }).order("mid", { ascending: true }).limit(limit);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
