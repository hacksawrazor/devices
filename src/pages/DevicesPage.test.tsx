import { render, screen, waitFor } from '@testing-library/react';
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
    expect(screen.getByRole('link', { name: 'Edit Desk lamp' })).toHaveAttribute('href', '/devices/lamp-1');
    expect(fetchMock).toHaveBeenCalledWith('https://apis.hacksaw.in/devices/api/devices', { credentials: 'include' });
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

    render(<MemoryRouter><DevicesPage /></MemoryRouter>);

    expect(await screen.findByText('Unauthorized')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Loading your connected devices…')).not.toBeInTheDocument());
  });

  it('links to the full-page add device form', async () => {
    mockFetch(jest.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    render(<MemoryRouter><DevicesPage /></MemoryRouter>);
    const buttons = await screen.findAllByRole('link', { name: 'Add device' });
    expect(buttons[0]).toHaveAttribute('href', '/devices/new');
  });
});
