import { createContext, useContext } from 'react';

export type FeedbackSeverity = 'success' | 'error';
export type FeedbackContextValue = { showFeedback: (message: string, severity: FeedbackSeverity) => void };

export const FeedbackContext = createContext<FeedbackContextValue>({ showFeedback: () => undefined });

export function useFeedback() {
  return useContext(FeedbackContext);
}
