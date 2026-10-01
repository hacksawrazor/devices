import { useState } from 'react';
import {
  buildDevicePayload,
  deleteDevice,
  saveDevice,
  type DevicePayload,
  type DevicePayloadSource,
} from '../utils/deviceApi';

interface DeviceWithId extends DevicePayloadSource {
  deviceId: string;
}

export default function useDeviceActions() {
  const [togglingDeviceIds, setTogglingDeviceIds] = useState<Set<string>>(() => new Set());

  const toggleCurrentState = async (device: DeviceWithId): Promise<boolean> => {
    const nextOn = !device.currentState?.on;
    setTogglingDeviceIds((current) => new Set(current).add(device.deviceId));

    try {
      await saveDevice(buildDevicePayload(device, nextOn), device.deviceId);
      return nextOn;
    } finally {
      setTogglingDeviceIds((current) => {
        const next = new Set(current);
        next.delete(device.deviceId);
        return next;
      });
    }
  };

  const save = (payload: DevicePayload, deviceId?: string) => saveDevice(payload, deviceId);
  const remove = (deviceId: string) => deleteDevice(deviceId);

  return { saveDevice: save, deleteDevice: remove, toggleCurrentState, togglingDeviceIds };
}