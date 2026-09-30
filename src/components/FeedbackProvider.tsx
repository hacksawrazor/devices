import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { FeedbackContext, type FeedbackSeverity } from './feedbackContext';

type FeedbackMessage = { message: string; severity: FeedbackSeverity } | null;

export default function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<FeedbackMessage>(null);

  const showFeedback = useCallback((message: string, severity: FeedbackSeverity) => {
    setFeedback({ message, severity });
  }, []);
  const contextValue = useMemo(() => ({ showFeedback }), [showFeedback]);

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setFeedback(null)}
      >
        <Alert
          severity={feedback?.severity ?? 'success'}
          variant="filled"
          onClose={() => setFeedback(null)}
          sx={{
            minWidth: 280,
            color: '#f4f7ef',
            bgcolor: feedback?.severity === 'error' ? '#332323' : '#202a20',
            border: `1px solid ${feedback?.severity === 'error' ? 'rgba(255, 116, 116, .55)' : 'rgba(184, 243, 74, .55)'}`,
            '& .MuiAlert-icon': { color: feedback?.severity === 'error' ? '#ff7474' : '#b8f34a' },
          }}
        >
          {feedback?.message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
}
