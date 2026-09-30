import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import FeedbackProvider from './FeedbackProvider';
import { useFeedback } from './feedbackContext';

function FeedbackButtons() {
  const { showFeedback } = useFeedback();
  return (
    <>
      <button onClick={() => showFeedback('Saved device', 'success')}>Show success</button>
      <button onClick={() => showFeedback('Could not save device', 'error')}>Show error</button>
    </>
  );
}

describe('FeedbackProvider', () => {
  it('shows themed success and error snackbars at the top right', () => {
    render(<FeedbackProvider><FeedbackButtons /></FeedbackProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Show success' }));
    const successAlert = screen.getByRole('alert');
    expect(successAlert).toHaveTextContent('Saved device');
    expect(successAlert).toHaveClass('MuiAlert-colorSuccess');
    expect(successAlert.closest('.MuiSnackbar-root')).toHaveClass('MuiSnackbar-anchorOriginTopRight');

    fireEvent.click(screen.getByRole('button', { name: 'Show error' }));
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveTextContent('Could not save device');
    expect(errorAlert).toHaveClass('MuiAlert-colorError');
  });

  it('dismisses the snackbar when its close button is clicked', async () => {
    render(<FeedbackProvider><FeedbackButtons /></FeedbackProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Show error' }));

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-colorError');
    await waitForElementToBeRemoved(() => screen.queryByRole('alert'));
  });
});
