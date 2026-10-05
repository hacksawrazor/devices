import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DevicesPage from './DevicesPage';
import FeedbackProvider from '../components/FeedbackProvider';
import { urls } from '../config/urls';

declare const process: { env: { NODE_ENV: string; VITE_DEVICE_API_TOKEN?: string } };

const mockFetch = (implementation: jest.Mock) => {
  globalThis.fetch = implementation as unknown as typeof fetch;
};

describe('DevicesPage', () => {
  let originalNodeEnv: string | undefined;
  let originalToken: string | undefined;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    originalToken = process.env.VITE_DEVICE_API_TOKEN;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
    if (originalToken === undefined) delete process.env.VITE_DEVICE_API_TOKEN;
    else process.env.VITE_DEVICE_API_TOKEN = originalToken;
  });

  it('fetches and displays devices as cards', async () => {
    const devices = [{
      deviceId: 'lamp-1',
      name: 'Desk lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff', 'action.devices.traits.Brightness'],
      willReportState: true,
      currentState: { on: true },
    }, {
      deviceId: 'switch-2',
      name: 'Entry switch',
      type: 'action.devices.types.SWITCH',
      traits: ['action.devices.traits.OnOff'],
      willReportState: false,
      currentState: { on: false },
    }];
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => devices });
    mockFetch(fetchMock);

    render(<MemoryRouter><DevicesPage /></MemoryRouter>);

    expect(screen.getByText('Loading your connected devices…')).toBeInTheDocument();
    expect(await screen.findByText('Desk lamp')).toBeInTheDocument();
    expect(screen.getByText('lamp-1')).toBeInTheDocument();
    expect(screen.getByText('LIGHT')).toBeInTheDocument();
    expect(screen.getAllByText('OnOff')).toHaveLength(2);
    expect(screen.getByText('Brightness')).toBeInTheDocument();
    expect(screen.getByText('On')).toBeInTheDocument();
    expect(screen.getByText('Off')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Desk lamp current state' })).toBeChecked();
    expect(screen.getByRole('switch', { name: 'Entry switch current state' })).not.toBeChecked();
    expect(screen.getByText('Reports state proactively')).toBeInTheDocument();
    const editLink = screen.getByRole('link', { name: 'Edit Desk lamp' });
    expect(editLink).toHaveAttribute('href', '/devices/lamp-1');
    expect(screen.getByText('Desk lamp').closest('a')).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith('https://apis.hacksaw.in/devices/api/devices', { credentials: 'include' });
  });

  it('adds the development authorization header when fetching devices', async () => {
    process.env.NODE_ENV = 'development';
    process.env.VITE_DEVICE_API_TOKEN = 'test-device-api-token';
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => [] });
    mockFetch(fetchMock);

    render(<MemoryRouter><DevicesPage /></MemoryRouter>);

    expect(await screen.findByText('No devices yet')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(urls.devicesApi, {
      credentials: 'include',
      headers: { Authorization: 'Bearer test-device-api-token' },
    });
  });

  it('toggles currentState from the card and preserves meta.state', async () => {
    const device = {
      deviceId: 'lamp-1',
      name: 'Desk lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: true,
      currentState: { on: true, brightness: 35 },
      meta: { state: { on: false, source: 'device-meta' } },
    };
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [device] })
      .mockResolvedValueOnce({ ok: true });
    mockFetch(fetchMock);

    render(<MemoryRouter><DevicesPage /></MemoryRouter>);

    const stateToggle = await screen.findByRole('switch', { name: 'Desk lamp current state' });
    expect(stateToggle).toBeChecked();
    fireEvent.click(stateToggle);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock).toHaveBeenLastCalledWith('https://apis.hacksaw.in/devices/api/devices/lamp-1', expect.objectContaining({
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }));
    const [, updateRequest] = fetchMock.mock.calls[1];
    expect(JSON.parse(updateRequest.body as string)).toMatchObject({
      currentState: { on: false, brightness: 35 },
      meta: { state: { on: false, source: 'device-meta' } },
    });
    await waitFor(() => expect(stateToggle).not.toBeChecked());
  });

  it('shows an empty state when there are no devices', async () => {
    mockFetch(jest.fn().mockResolvedValue({ ok: true, json: async () => [] }));

    render(<MemoryRouter><DevicesPage /></MemoryRouter>);

    expect(await screen.findByText('No devices yet')).toBeInTheDocument();
    expect(screen.getByText('0 devices registered')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Add device' }).length).toBeGreaterThan(0);
  });

  it('shows an error if the request fails', async () => {
    mockFetch(jest.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: 'Unauthorized' }) }));

    render(<FeedbackProvider><MemoryRouter><DevicesPage /></MemoryRouter></FeedbackProvider>);

    expect(await screen.findByRole('alert')).toHaveTextContent('Unauthorized');
    await waitFor(() => expect(screen.queryByText('Loading your connected devices…')).not.toBeInTheDocument());
  });

  it('links to the full-page add device form', async () => {
    mockFetch(jest.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    render(<MemoryRouter><DevicesPage /></MemoryRouter>);
    const buttons = await screen.findAllByRole('link', { name: 'Add device' });
    expect(buttons[0]).toHaveAttribute('href', '/devices/new');
  });

  it('renders header and footer components', async () => {
    mockFetch(jest.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    render(<MemoryRouter><DevicesPage /></MemoryRouter>);

    expect(await screen.findByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

