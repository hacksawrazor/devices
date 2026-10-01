import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DeviceDetailsPage from './DeviceDetailsPage';
import { urls } from '../config/urls';
import FeedbackProvider from '../components/FeedbackProvider';

declare const process: { env: { NODE_ENV: string; VITE_DEVICE_API_TOKEN?: string } };

describe('DeviceDetailsPage', () => {
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

  it('loads a device by id and displays the shared edit form', async () => {
    const device = {
      deviceId: 'lamp-7',
      name: 'Reading lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: false,
      currentState: { on: false },
    };
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => device });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    render(
      <MemoryRouter initialEntries={['/devices/lamp-7']}>
        <Routes><Route path="/devices/:id" element={<DeviceDetailsPage />} /></Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Edit Device' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Reading lamp');
    expect(screen.getByText('Device ID: lamp-7')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(`${urls.devicesApi}/lamp-7`, { credentials: 'include' });
  });

  it('adds the development authorization header when loading a device', async () => {
    process.env.NODE_ENV = 'development';
    process.env.VITE_DEVICE_API_TOKEN = 'test-device-api-token';
    const device = {
      deviceId: 'lamp-7',
      name: 'Reading lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: false,
      currentState: { on: false },
    };
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => device });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    render(
      <MemoryRouter initialEntries={['/devices/lamp-7']}>
        <Routes><Route path="/devices/:id" element={<DeviceDetailsPage />} /></Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Edit Device' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(`${urls.devicesApi}/lamp-7`, {
      credentials: 'include',
      headers: { Authorization: 'Bearer test-device-api-token' },
    });
  });

  it('shows the API error when the device cannot be loaded', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Device not found' }),
    }) as unknown as typeof fetch;

    render(
      <FeedbackProvider>
        <MemoryRouter initialEntries={['/devices/missing']}>
          <Routes><Route path="/devices/:id" element={<DeviceDetailsPage />} /></Routes>
        </MemoryRouter>
      </FeedbackProvider>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Device not found');
    expect(screen.getByRole('button', { name: 'Back to devices' })).toBeInTheDocument();
  });

  it('returns to the device list after a successful update', async () => {
    const device = {
      deviceId: 'lamp-7',
      name: 'Reading lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: false,
      currentState: { on: false },
    };
    globalThis.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => device })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ...device, name: 'Bedside lamp' }) }) as unknown as typeof fetch;

    render(
      <MemoryRouter initialEntries={['/devices/lamp-7']}>
        <Routes>
          <Route path="/devices/:id" element={<DeviceDetailsPage />} />
          <Route path="/devices" element={<h1>Device list</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Edit Device' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Bedside lamp' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Device' }));

    expect(await screen.findByRole('heading', { name: 'Device list' })).toBeInTheDocument();
  });
});
