import { urls } from '../config/urls';

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
  const response = await fetch(url, {
    method,
    credentials: 'include',
    ...(payload ? {
      headers: { 'Content-Type': 'application/json' },
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