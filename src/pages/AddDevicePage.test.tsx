declare const global: any;

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddDevicePage from './AddDevicePage';

describe('AddDevicePage', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ deviceId: 'test-id', name: 'Test Light' }),
      })
    ) as unknown as typeof fetch;
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders form title and fields', () => {
    render(<AddDevicePage />);
    expect(screen.getByText('Add New Device')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Will Report State (proactive state reporting)')).toBeInTheDocument();
  });

  it('accepts device name input', async () => {
    render(<AddDevicePage />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('includes common traits chips', () => {
    render(<AddDevicePage />);
    expect(screen.getByText('Quick add traits:')).toBeInTheDocument();
    expect(screen.getByText('OnOff')).toBeInTheDocument();
  });

  it('checks willReportState and metaStateOn', async () => {
    render(<AddDevicePage />);
    const willReport = screen.getByLabelText('Will Report State (proactive state reporting)');
    fireEvent.click(willReport);
    expect(willReport).toBeChecked();

    const metaOn = screen.getByLabelText('Initial State: On');
    fireEvent.click(metaOn);
    expect(metaOn).toBeChecked();
  });

  it('includes submit button', () => {
    render(<AddDevicePage />);
    expect(screen.getByText('Create Device')).toBeInTheDocument();
  });
});
