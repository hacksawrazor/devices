import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DevicesPage from './DevicesPage';

const mockFetch = (implementation: jest.Mock) => {
  globalThis.fetch = implementation as unknown as typeof fetch;
};

describe('DevicesPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches and displays devices as cards', async () => {
    const devices = [{
      deviceId: 'lamp-1',
      name: 'Desk lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff', 'action.devices.traits.Brightness'],
      willReportState: true,
      meta: { state: { on: true } },
    }];
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => devices });
    mockFetch(fetchMock);

    render(<MemoryRouter><DevicesPage /></MemoryRouter>);

    expect(screen.getByText('Loading your connected devices…')).toBeInTheDocument();
    expect(await screen.findByText('Desk lamp')).toBeInTheDocument();
    expect(screen.getByText('lamp-1')).toBeInTheDocument();
    expect(screen.getByText('LIGHT')).toBeInTheDocument();
    expect(screen.getByText('OnOff')).toBeInTheDocument();
    expect(screen.getByText('Brightness')).toBeInTheDocument();
    expect(screen.getByText('On')).toBeInTheDocument();
    expect(screen.getByText('Reports state proactively')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('https://apis.hacksaw.in/devices/api/devices', { credentials: 'include' });
  });

  it('shows an empty state when there are no devices', async () => {
    mockFetch(jest.fn().mockResolvedValue({ ok: true, json: async () => [] }));

    render(<MemoryRouter><DevicesPage /></MemoryRouter>);

    expect(await screen.findByText('No devices yet')).toBeInTheDocument();
    expect(screen.getByText('0 devices registered')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Add device' }).length).toBeGreaterThan(0);
  });

  it('shows an error if the request fails', async () => {
    mockFetch(jest.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: 'Unauthorized' }) }));

    render(<MemoryRouter><DevicesPage /></MemoryRouter>);

    expect(await screen.findByText('Unauthorized')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Loading your connected devices…')).not.toBeInTheDocument());
  });

  it('opens the add form in a popup and refreshes devices after creation', async () => {
    const createdDevice = {
      deviceId: 'new-lamp',
      name: 'New lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: false,
      meta: { state: { on: false } },
    };
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => createdDevice })
      .mockResolvedValueOnce({ ok: true, json: async () => [createdDevice] });
    mockFetch(fetchMock);

    render(<MemoryRouter><DevicesPage /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: 'Add device' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'New lamp' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Device' }));

    expect(await screen.findByText(/Device created successfully/)).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    expect(await screen.findByText('new-lamp')).toBeInTheDocument();
  });
});
