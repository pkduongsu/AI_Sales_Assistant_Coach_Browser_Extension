// src/server/suggestions/api/getSuggestion.ts

export type Suggestion = {
  id: string;
  type: "discovery" | "qualify" | "offer";
  message: string;
  rationale: string;
};

export type RawSuggestionResponse = {
  thread_id: string;
  based_on_mid: string;
  suggestions: string | Suggestion[]; // Can be either stringified or array
  generated_at: string;
};

export type SuggestionData = {
  thread_id: string;
  based_on_mid: string;
  suggestions: Suggestion[];
  generated_at: string;
};

export type SuggestionResponse = SuggestionData[];

export async function getSuggestion(threadId: string): Promise<SuggestionResponse> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  const authToken = import.meta.env.VITE_N8N_WEBHOOK_AUTHORIZATION_TOKEN;

  if (!webhookUrl) {
    throw new Error('VITE_N8N_WEBHOOK_URL environment variable is required');
  }

  if (!authToken) {
    throw new Error('VITE_N8N_WEBHOOK_AUTHORIZATION_TOKEN environment variable is required');
  }

  const url = `${webhookUrl}?thread_id=${encodeURIComponent(threadId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `${authToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get suggestions: ${response.status} ${response.statusText}`);
  }

  const rawData: RawSuggestionResponse[] = await response.json();
  console.log('Raw API response:', rawData);

  // The response is an array, get the first (and only) item
  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    throw new Error('Invalid response format: expected array with at least one item');
  }

  const responseData = rawData[0];
  console.log('First response item:', responseData);

  // Use the clean response data
  const cleanThreadId = responseData.thread_id;
  const cleanBasedOnMid = responseData.based_on_mid;
  const cleanGeneratedAt = responseData.generated_at;

  // Handle suggestions field - parse the stringified JSON
  let suggestions: Suggestion[] = [];
  try {
    const suggestionsData = responseData.suggestions;
    console.log('Processing suggestions data:', suggestionsData, typeof suggestionsData);

    // The suggestions should be a stringified JSON array
    if (typeof suggestionsData === 'string') {
      suggestions = JSON.parse(suggestionsData);
      console.log('Parsed suggestions from JSON string:', suggestions);
    }
    // If it's already an array, use it directly
    else if (Array.isArray(suggestionsData)) {
      suggestions = suggestionsData;
      console.log('Using suggestions array directly:', suggestions);
    }

    console.log('Final parsed suggestions:', suggestions);
  } catch (error) {
    console.warn('Failed to parse suggestions:', error, responseData.suggestions);
    suggestions = [];
  }

  // Return as array format expected by the UI
  const parsedData: SuggestionData = {
    thread_id: cleanThreadId,
    based_on_mid: cleanBasedOnMid,
    suggestions,
    generated_at: cleanGeneratedAt
  };

  return [parsedData];
}

// Note: getLatestSuggestions function removed since we now display all suggestions directly

// Helper function to get suggestions by type
export function getSuggestionsByType(suggestions: Suggestion[], type: Suggestion['type']): Suggestion[] {
  return suggestions.filter(suggestion => suggestion.type === type);
}