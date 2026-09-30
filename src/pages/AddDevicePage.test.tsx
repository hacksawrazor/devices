import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AddDevicePage from './AddDevicePage';

describe('AddDevicePage', () => {
  it('returns to the device list after a successful create', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ deviceId: 'new-device', name: 'Desk light' }),
    }) as unknown as typeof fetch;

    render(
      <MemoryRouter initialEntries={['/devices/new']}>
        <Routes>
          <Route path="/devices/new" element={<AddDevicePage />} />
          <Route path="/devices" element={<h1>Device list</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Desk light' } });
    fireEvent.click(screen.getByRole('button', { name: 'OnOff' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create Device' }));

    expect(await screen.findByRole('heading', { name: 'Device list' })).toBeInTheDocument();
  });
});
