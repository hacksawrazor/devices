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

  it('shows validation errors without sending an incomplete form', () => {
    render(<AddDeviceForm />);
    fireEvent.submit(screen.getByRole('button', { name: 'Create Device' }).closest('form')!);

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('creates a device and calls onCreated after success', async () => {
    const onCreated = jest.fn();
    render(<AddDeviceForm onCreated={onCreated} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Test Light' } });
    fireEvent.click(screen.getByLabelText('Will Report State (proactive state reporting)'));
    fireEvent.click(screen.getByLabelText('Initial State: On'));
    fireEvent.click(screen.getByRole('button', { name: 'Create Device' }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    const [, request] = fetchMock.mock.calls[0];
    expect(fetchMock).toHaveBeenCalledWith('https://apis.hacksaw.in/devices/api/devices', expect.objectContaining({
      method: 'POST',
      credentials: 'include',
    }));
    expect(JSON.parse(request.body as string)).toEqual({
      name: 'Test Light',
      type: 'action.devices.types.LIGHT',
      traits: expect.arrayContaining(['action.devices.traits.OnOff']),
      willReportState: true,
      meta: { state: { on: true } },
    });
    expect(screen.getByText(/Device created successfully/)).toBeInTheDocument();
  });

  it('shows the API error when device creation fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Device service unavailable' }),
    });
    render(<AddDeviceForm />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Test Light' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Device' }));

    expect(await screen.findByText(/Device service unavailable/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Device' })).toBeEnabled();
  });
});
