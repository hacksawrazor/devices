import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import AddDeviceForm from './AddDeviceForm';
import { urls } from '../config/urls';
import FeedbackProvider from './FeedbackProvider';

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
    expect(screen.queryByText('Create a new smart home device.')).not.toBeInTheDocument();
    expect(screen.getByText('The server will generate a unique deviceId.')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Will Report State (proactive state reporting)')).toBeInTheDocument();
    expect(screen.getByText('Is Virtual Device (skip MQTT publish/report processing)')).toBeInTheDocument();
    expect(screen.queryByText('Created By')).not.toBeInTheDocument();
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
    expect(screen.getByRole('textbox', { name: 'Traits (comma-separated)' })).toHaveValue('');
  });

  it('adds and removes a trait when its quick-add chip is toggled', () => {
    render(<AddDeviceForm />);
    const traitsField = screen.getByRole('textbox', { name: 'Traits (comma-separated)' });
    const onOffChip = screen.getByRole('button', { name: 'OnOff' });

    fireEvent.click(onOffChip);
    expect(traitsField).toHaveValue('action.devices.traits.OnOff');

    fireEvent.click(onOffChip);
    expect(traitsField).toHaveValue('');
  });

  it('checks willReportState and the initial state', async () => {
    render(<AddDeviceForm />);
    const willReport = screen.getByLabelText('Will Report State (proactive state reporting)');
    fireEvent.click(willReport);
    expect(willReport).toBeChecked();

    const currentStateOn = screen.getByLabelText('Current State: On');
    fireEvent.click(currentStateOn);
    expect(currentStateOn).toBeChecked();

    const metaStateOn = screen.getByLabelText('Meta State: On');
    fireEvent.click(metaStateOn);
    expect(metaStateOn).toBeChecked();
  });

  it('checks isVirtualDevice checkbox', async () => {
    render(<AddDeviceForm />);
    const virtualDevice = screen.getByLabelText('Is Virtual Device (skip MQTT publish/report processing)');
    expect(virtualDevice).not.toBeChecked();
    fireEvent.click(virtualDevice);
    expect(virtualDevice).toBeChecked();
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

  it('creates a device and calls onSaved after success without showing response JSON', async () => {
    const onSaved = jest.fn();
    render(<FeedbackProvider><AddDeviceForm onSaved={onSaved} /></FeedbackProvider>);
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Test Light' } });
    fireEvent.click(screen.getByRole('button', { name: 'OnOff' }));
    fireEvent.click(screen.getByLabelText('Will Report State (proactive state reporting)'));
    fireEvent.click(screen.getByLabelText('Current State: On'));
    fireEvent.click(screen.getByLabelText('Meta State: On'));
    fireEvent.click(screen.getByLabelText('Is Virtual Device (skip MQTT publish/report processing)'));
    fireEvent.click(screen.getByRole('button', { name: 'Create Device' }));

    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1));
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
      isVirtualDevice: true,
      currentState: { on: true },
      meta: { state: { on: true } },
    });
    expect(screen.getByText(/Device created successfully/)).toBeInTheDocument();
    expect(screen.queryByText('test-id')).not.toBeInTheDocument();
  });

  it('loads existing values and updates the device with PUT', async () => {
    const existingDevice = {
      deviceId: 'device-42',
      name: 'Hall lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: true,
      meta: { state: { on: false, source: 'device-meta' } },
      currentState: { on: true },
    };
    render(<FeedbackProvider><AddDeviceForm device={existingDevice} /></FeedbackProvider>);

    expect(screen.getByText('Edit Device')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Hall lamp');
    expect(screen.getByRole('textbox', { name: 'Traits (comma-separated)' })).toHaveValue('action.devices.traits.OnOff');
    expect(screen.getByLabelText('Will Report State (proactive state reporting)')).toBeChecked();
    expect(screen.getByLabelText('Current State: On')).toBeChecked();
    expect(screen.getByLabelText('Meta State: On')).not.toBeChecked();

    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Entry lamp' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Device' }));

    expect(await screen.findByText(/Device updated successfully/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(`${urls.devicesApi}/device-42`, expect.objectContaining({
      method: 'PUT',
      credentials: 'include',
      body: expect.stringContaining('Entry lamp'),
    }));
    const [, updateRequest] = fetchMock.mock.calls[0];
    expect(JSON.parse(updateRequest.body as string)).toMatchObject({
      currentState: { on: true },
      meta: { state: { on: false, source: 'device-meta' } },
    });
    expect(screen.getByRole('button', { name: 'Delete device' })).toBeInTheDocument();
  });

  it('displays read-only createdBy field and loads isVirtualDevice for pre-existing devices', () => {
    const existingDevice = {
      deviceId: 'device-42',
      name: 'Hall lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: true,
      isVirtualDevice: true,
      createdBy: 'user_xyz789',
      currentState: { on: true },
    };
    render(<FeedbackProvider><AddDeviceForm device={existingDevice} /></FeedbackProvider>);

    const createdByField = screen.getByRole('textbox', { name: 'Created By' });
    expect(createdByField).toBeInTheDocument();
    expect(createdByField).toHaveValue('user_xyz789');
    expect(createdByField).toHaveAttribute('readonly');

    const virtualCheckbox = screen.getByLabelText('Is Virtual Device (skip MQTT publish/report processing)');
    expect(virtualCheckbox).toBeChecked();
  });

  it('confirms and deletes an existing device', async () => {
    const onDeleted = jest.fn();
    render(<FeedbackProvider><AddDeviceForm
      device={{
        deviceId: 'device-42',
        name: 'Hall lamp',
        type: 'action.devices.types.LIGHT',
        traits: ['action.devices.traits.OnOff'],
        willReportState: false,
        currentState: { on: false },
      }}
      onDeleted={onDeleted}
    /></FeedbackProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Delete device' }));
    expect(await screen.findByRole('dialog', { name: 'Delete device?' })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete device' }));

    await waitFor(() => expect(onDeleted).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(`${urls.devicesApi}/device-42`, expect.objectContaining({
      method: 'DELETE',
      credentials: 'include',
    }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Device deleted successfully');
  });

  it('shows an error snackbar when an update fails', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ error: 'Update failed' }) });
    render(<FeedbackProvider><AddDeviceForm device={{
      deviceId: 'device-42',
      name: 'Hall lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: false,
    }} /></FeedbackProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Update Device' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Update failed');
  });

  it('shows an error snackbar and stays on the form when deletion fails', async () => {
    const onDeleted = jest.fn();
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ error: 'Delete failed' }) });
    render(<FeedbackProvider><AddDeviceForm device={{
      deviceId: 'device-42',
      name: 'Hall lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: false,
    }} onDeleted={onDeleted} /></FeedbackProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Delete device' }));
    fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Delete device' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Delete failed');
    expect(onDeleted).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Edit Device' })).toBeInTheDocument();
  });

  it('does not show a delete action when creating a device', () => {
    render(<FeedbackProvider><AddDeviceForm /></FeedbackProvider>);
    expect(screen.queryByRole('button', { name: 'Delete device' })).not.toBeInTheDocument();
  });

  it('shows the API error when device creation fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Device service unavailable' }),
    });
    render(<FeedbackProvider><AddDeviceForm /></FeedbackProvider>);
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Test Light' } });
    fireEvent.click(screen.getByRole('button', { name: 'OnOff' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create Device' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Device service unavailable');
    expect(screen.getByRole('button', { name: 'Create Device' })).toBeEnabled();
  });
});
