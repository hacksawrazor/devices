import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { Alert, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { FeedbackContext, type FeedbackSeverity } from './feedbackContext';

type FeedbackMessage = { id: number; message: string; severity: FeedbackSeverity } | null;

export default function FeedbackProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [feedback, setFeedback] = useState<FeedbackMessage>(null);
  const [open, setOpen] = useState(false);
  const feedbackId = useRef(0);

  const showFeedback = useCallback((message: string, severity: FeedbackSeverity) => {
    feedbackId.current += 1;
    setFeedback({ id: feedbackId.current, message, severity });
    setOpen(true);
  }, []);
  const contextValue = useMemo(() => ({ showFeedback }), [showFeedback]);
  const exitingFeedbackId = feedback?.id;

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
      <Snackbar
        key={feedback?.id}
        open={open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: isSmallScreen ? 'center' : 'right' }}
        onClose={() => setOpen(false)}
        slotProps={{
          transition: {
            onExited: () => setFeedback((current) => current?.id === exitingFeedbackId ? null : current),
          },
        }}
      >
        <Alert
          severity={feedback?.severity ?? 'error'}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{
            minWidth: 280,
            color: '#f4f7ef',
            bgcolor: feedback?.severity === 'error' ? '#332323' : '#202a20',
            border: `1px solid ${feedback?.severity === 'error' ? 'rgba(255, 116, 116, .55)' : 'rgba(184, 243, 74, .55)'}`,
            '& .MuiAlert-icon': { color: feedback?.severity === 'error' ? '#ff7474' : '#b8f34a' },
          }}
        >
          {feedback?.message ?? ''}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
}
