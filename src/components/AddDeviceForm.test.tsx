import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddDeviceForm from './AddDeviceForm';

const fetchMock = jest.fn();

describe('AddDeviceForm', () => {
  beforeEach(() => {
    fetchMock.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ deviceId: 'test-id', name: 'Test Light' }),
      })
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders form title and fields', () => {
    render(<AddDeviceForm />);
    expect(screen.getByText('Add New Device')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Will Report State (proactive state reporting)')).toBeInTheDocument();
  });

  it('accepts device name input', async () => {
    render(<AddDeviceForm />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('includes common traits chips', () => {
    render(<AddDeviceForm />);
    expect(screen.getByText('Quick add traits:')).toBeInTheDocument();
    expect(screen.getByText('OnOff')).toBeInTheDocument();
  });

  it('checks willReportState and metaStateOn', async () => {
    render(<AddDeviceForm />);
    const willReport = screen.getByLabelText('Will Report State (proactive state reporting)');
    fireEvent.click(willReport);
    expect(willReport).toBeChecked();

    const metaOn = screen.getByLabelText('Initial State: On');
    fireEvent.click(metaOn);
    expect(metaOn).toBeChecked();
  });

  it('includes submit button', () => {
    render(<AddDeviceForm />);
    expect(screen.getByText('Create Device')).toBeInTheDocument();
  });

  it('creates a device and calls onCreated after success', async () => {
    const onCreated = jest.fn();
    render(<AddDeviceForm onCreated={onCreated} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Test Light' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Device' }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith('https://apis.hacksaw.in/devices/api/devices', expect.objectContaining({
      method: 'POST',
      credentials: 'include',
      body: expect.stringContaining('Test Light'),
    }));
    expect(screen.getByText(/Device created successfully/)).toBeInTheDocument();
  });
});
