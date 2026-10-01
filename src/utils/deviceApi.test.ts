import {
  buildDevicePayload,
  deleteDevice,
  saveDevice,
  type DevicePayload,
  type DevicePayloadSource,
} from './deviceApi';
import { urls } from '../config/urls';

const setFetchMock = (fetchMock: jest.Mock) => {
  globalThis.fetch = fetchMock as unknown as typeof fetch;
};

describe('deviceApi', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('buildDevicePayload', () => {
    const device: DevicePayloadSource = {
      name: 'Desk lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: true,
      isVirtualDevice: false,
      currentState: { on: true, brightness: 45 },
      meta: { source: 'fixture', state: { on: false, updatedBy: 'test' } },
    };

    it('updates currentState and meta.state independently and preserves additional fields', () => {
      expect(buildDevicePayload(device, false, true)).toEqual({
        name: 'Desk lamp',
        type: 'action.devices.types.LIGHT',
        traits: ['action.devices.traits.OnOff'],
        willReportState: true,
        isVirtualDevice: false,
        currentState: { on: false, brightness: 45 },
        meta: { source: 'fixture', state: { on: true, updatedBy: 'test' } },
      });
    });

    it('uses the existing meta state when no override is supplied', () => {
      expect(buildDevicePayload(device, false).meta.state.on).toBe(false);
    });
  });

  describe('saveDevice', () => {
    const payload: DevicePayload = {
      name: 'Desk lamp',
      type: 'action.devices.types.LIGHT',
      traits: ['action.devices.traits.OnOff'],
      willReportState: true,
      currentState: { on: true },
      meta: { state: { on: false } },
    };

    it('creates a device with POST', async () => {
      const fetchMock = jest.fn().mockResolvedValue({ ok: true });
      setFetchMock(fetchMock);

      await saveDevice(payload);

      expect(fetchMock).toHaveBeenCalledWith(urls.devicesApi, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    });

    it('updates a device with PUT and encodes its id', async () => {
      const fetchMock = jest.fn().mockResolvedValue({ ok: true });
      setFetchMock(fetchMock);

      await saveDevice(payload, 'lamp/one');

      expect(fetchMock).toHaveBeenCalledWith(`${urls.devicesApi}/lamp%2Fone`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    });
  });

  it('deletes a device without a request body', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    setFetchMock(fetchMock);

    await deleteDevice('lamp/one');

    expect(fetchMock).toHaveBeenCalledWith(`${urls.devicesApi}/lamp%2Fone`, {
      method: 'DELETE',
      credentials: 'include',
    });
  });

  it.each([
    [{ error: 'Device unavailable' }, 'Device unavailable'],
    [{}, 'HTTP 503'],
  ])('throws the API error message or status fallback', async (errorBody, expectedMessage) => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => errorBody,
    });
    setFetchMock(fetchMock);

    await expect(saveDevice({
      name: 'Desk lamp',
      type: 'action.devices.types.LIGHT',
      traits: [],
      willReportState: false,
      currentState: { on: false },
      meta: { state: { on: false } },
    })).rejects.toThrow(expectedMessage);
  });
});