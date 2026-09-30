import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DeviceDetailsPage from './DeviceDetailsPage';
import { urls } from '../config/urls';

describe('DeviceDetailsPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads a device by id and displays the shared edit form', async () => {
    const device = {
      deviceId: 'lamp-7',
      name: 'Reading lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: false,
      meta: { state: { on: false } },
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

  it('shows the API error when the device cannot be loaded', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Device not found' }),
    }) as unknown as typeof fetch;

    render(
      <MemoryRouter initialEntries={['/devices/missing']}>
        <Routes><Route path="/devices/:id" element={<DeviceDetailsPage />} /></Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Device not found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to devices' })).toBeInTheDocument();
  });
});
