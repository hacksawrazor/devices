import { act, renderHook } from '@testing-library/react';
import useDeviceActions from './useDeviceActions';
import { urls } from '../config/urls';
import type { DevicePayload } from '../utils/deviceApi';

describe('useDeviceActions', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('saves new and existing devices and deletes by encoded device id', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { result } = renderHook(() => useDeviceActions());
    const payload: DevicePayload = {
      name: 'Desk lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: true,
      currentState: { on: true },
      meta: { state: { on: false } },
    };

    await act(async () => {
      await result.current.saveDevice(payload);
      await result.current.saveDevice(payload, 'lamp/one');
      await result.current.deleteDevice('lamp/one');
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, urls.devicesApi, expect.objectContaining({ method: 'POST' }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, `${urls.devicesApi}/lamp%2Fone`, expect.objectContaining({ method: 'PUT' }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, `${urls.devicesApi}/lamp%2Fone`, expect.objectContaining({
      method: 'DELETE',
      credentials: 'include',
    }));
  });

  it('tracks a state toggle until the update succeeds and retains both state fields', async () => {
    let resolveResponse!: (response: { ok: boolean }) => void;
    const responsePromise = new Promise<{ ok: boolean }>((resolve) => {
      resolveResponse = resolve;
    });
    const fetchMock = jest.fn().mockReturnValue(responsePromise);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { result } = renderHook(() => useDeviceActions());
    const device = {
      deviceId: 'lamp-1',
      name: 'Desk lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: true,
      currentState: { on: true, brightness: 40 },
      meta: { state: { on: false, source: 'device-meta' } },
    };
    let togglePromise!: Promise<boolean>;

    act(() => {
      togglePromise = result.current.toggleCurrentState(device);
    });

    expect(result.current.togglingDeviceIds.has('lamp-1')).toBe(true);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).toMatchObject({
      currentState: { on: false, brightness: 40 },
      meta: { state: { on: false, source: 'device-meta' } },
    });

    await act(async () => {
      resolveResponse({ ok: true });
      await expect(togglePromise).resolves.toBe(false);
    });

    expect(result.current.togglingDeviceIds.has('lamp-1')).toBe(false);
  });

  it('clears pending toggle state when the update fails', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: 'Device unavailable' }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { result } = renderHook(() => useDeviceActions());
    const device = {
      deviceId: 'lamp-1',
      name: 'Desk lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: true,
      currentState: { on: false },
    };
    let togglePromise!: Promise<boolean>;

    act(() => {
      togglePromise = result.current.toggleCurrentState(device);
    });

    await act(async () => {
      await expect(togglePromise).rejects.toThrow('Device unavailable');
    });

    expect(result.current.togglingDeviceIds.has('lamp-1')).toBe(false);
  });
});