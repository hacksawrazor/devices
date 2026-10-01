import { urls } from '../config/urls';
import { getRuntimeEnvironment } from '../config/runtimeEnvironment';

interface DeviceState {
  on?: boolean;
  [key: string]: unknown;
}

interface DeviceMeta {
  state?: DeviceState;
  [key: string]: unknown;
}

export interface DevicePayloadSource {
  name: string;
  type: string;
  traits: string[];
  willReportState: boolean;
  isVirtualDevice?: boolean;
  currentState?: DeviceState;
  meta?: DeviceMeta;
}

export interface DevicePayload extends Omit<DevicePayloadSource, 'currentState' | 'meta'> {
  currentState: DeviceState & { on: boolean };
  meta: DeviceMeta & { state: DeviceState & { on: boolean } };
}

export function getDeviceApiHeaders(): { Authorization: string } | undefined {
  const { isDevelopment, deviceApiToken } = getRuntimeEnvironment();
  return isDevelopment && deviceApiToken
    ? { Authorization: `Bearer ${deviceApiToken}` }
    : undefined;
}

export function buildDevicePayload(
  device: DevicePayloadSource,
  currentStateOn: boolean,
  metaStateOn = device.meta?.state?.on ?? false,
): DevicePayload {
  return {
    name: device.name,
    type: device.type,
    traits: device.traits,
    willReportState: device.willReportState,
    isVirtualDevice: device.isVirtualDevice,
    currentState: { ...device.currentState, on: currentStateOn },
    meta: {
      ...device.meta,
      state: { ...device.meta?.state, on: metaStateOn },
    },
  };
}

async function requestDevice(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE',
  payload?: DevicePayload,
): Promise<void> {
  const headers = {
    ...(payload ? { 'Content-Type': 'application/json' } : {}),
    ...getDeviceApiHeaders(),
  };
  const response = await fetch(url, {
    method,
    credentials: 'include',
    ...(Object.keys(headers).length > 0 ? { headers } : {}),
    ...(payload ? {
      body: JSON.stringify(payload),
    } : {}),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || `HTTP ${response.status}`);
  }
}

export function saveDevice(payload: DevicePayload, deviceId?: string): Promise<void> {
  return requestDevice(
    deviceId ? `${urls.devicesApi}/${encodeURIComponent(deviceId)}` : urls.devicesApi,
    deviceId ? 'PUT' : 'POST',
    payload,
  );
}

export function deleteDevice(deviceId: string): Promise<void> {
  return requestDevice(`${urls.devicesApi}/${encodeURIComponent(deviceId)}`, 'DELETE');
}