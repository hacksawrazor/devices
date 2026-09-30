import React, { useState } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { urls } from '../config/urls';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  Box,
} from '@mui/material';

interface DeviceFormData {
  name: string;
  type: string;
  traits: string;
  willReportState: boolean;
  metaStateOn: boolean;
}

export interface DeviceRecord extends Omit<DeviceFormData, 'traits' | 'metaStateOn'> {
  deviceId: string;
  traits: string[];
  meta?: { state?: { on?: boolean }; [key: string]: unknown };
}

interface FormErrors {
  name?: string;
  type?: string;
  traits?: string;
}

const DEFAULT_DEVICE_TYPES = [
  'action.devices.types.LIGHT',
  'action.devices.types.SWITCH',
  'action.devices.types.OUTLET',
  'action.devices.types.FAN',
  'action.devices.types.THERMOSTAT',
  'action.devices.types.CAMERA',
  'action.devices.types.LOCK',
  'action.devices.types.DOOR',
  'action.devices.types.WINDOW',
  'action.devices.types.BLINDS',
  'action.devices.types.VACUUM',
  'action.devices.types.WASHER',
  'action.devices.types.DRYER',
  'action.devices.types.DISHWASHER',
  'action.devices.types.OVEN',
  'action.devices.types.MICROWAVE',
  'action.devices.types.REFRIGERATOR',
];

const COMMON_TRAITS = [
  'action.devices.traits.OnOff',
  'action.devices.traits.Brightness',
  'action.devices.traits.ColorSetting',
  'action.devices.traits.TemperatureSetting',
  'action.devices.traits.LockUnlock',
  'action.devices.traits.OpenClose',
  'action.devices.traits.StartStop',
  'action.devices.traits.RunCycle',
  'action.devices.traits.Modes',
  'action.devices.traits.Toggles',
];

export interface AddDeviceFormProps {
  onCreated?: () => void;
  onBack?: () => void;
  device?: DeviceRecord;
}

export default function AddDeviceForm({ onCreated, onBack, device: existingDevice }: AddDeviceFormProps) {
  const isEditing = Boolean(existingDevice);
  const [device, setDevice] = useState<DeviceFormData>(() => ({
    name: existingDevice?.name ?? '',
    type: existingDevice?.type ?? 'action.devices.types.LIGHT',
    traits: existingDevice?.traits.join(', ') ?? '',
    willReportState: existingDevice?.willReportState ?? false,
    metaStateOn: existingDevice?.meta?.state?.on ?? false,
  }));

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; data?: unknown } | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!device.name.trim()) newErrors.name = 'Name is required';
    if (!device.type.trim()) newErrors.type = 'Type is required';
    if (!device.traits.trim()) newErrors.traits = 'At least one trait is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseTraits = (traitsString: string): string[] => {
    return traitsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      name: device.name.trim(),
      type: device.type.trim(),
      traits: parseTraits(device.traits),
      willReportState: device.willReportState,
      meta: {
        state: {
          on: device.metaStateOn,
        },
      },
    };

    try {
      
      const response = await fetch(
        isEditing ? `${urls.devicesApi}/${encodeURIComponent(existingDevice!.deviceId)}` : urls.devicesApi,
        {
        method: isEditing ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setSubmitResult({ success: true, message: isEditing ? 'Device updated successfully' : 'Device created successfully', data });
      if (isEditing) return;
      onCreated?.();
      setDevice({ ...device, name: '', type: 'action.devices.types.LIGHT', traits: '' });
    } catch (err) {
      setSubmitResult({ success: false, message: err instanceof Error ? err.message : 'Failed to create device' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 960, mx: 'auto', mt: 4, mb: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEditing ? 'Edit Device' : 'Add New Device'}
        </Typography>
        {submitResult && (
          <Alert
            severity={submitResult.success ? 'success' : 'error'}
            sx={{ mb: 3 }}
            onClose={() => setSubmitResult(null)}
          >
            {submitResult.success ? '✓ ' : '✗ '}{submitResult.message}
            {submitResult.data && (
              <Box component="pre" sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', overflow: 'auto', fontSize: '0.8rem' }}>
                {JSON.stringify(submitResult.data, null, 2)}
              </Box>
            )}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Name"
              value={device.name}
              onChange={(e) => setDevice({ ...device, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Type"
              value={device.type}
              onChange={(e) => setDevice({ ...device, type: e.target.value })}
              error={!!errors.type}
              helperText={errors.type}
              required
              select
              slotProps={{ select: { native: true } }}
            >
              {DEFAULT_DEVICE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </TextField>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Traits (comma-separated)"
              value={device.traits}
              onChange={(e) => setDevice({ ...device, traits: e.target.value })}
              error={!!errors.traits}
              helperText={errors.traits || 'Enter Google device traits, comma-separated. Common: OnOff, Brightness, ColorSetting...'}
              required
              multiline
              rows={2}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Quick add traits:
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {COMMON_TRAITS.map((trait) => (
                <Chip
                  key={trait}
                  label={trait.replace('action.devices.traits.', '')}
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const current = device.traits;
                    const newTraits = current.includes(trait)
                      ? current.replace(trait, '').replace(/,,/g, ',').replace(/^,|,$/g, '').trim()
                      : current ? `${current}, ${trait}` : trait;
                    setDevice({ ...device, traits: newTraits });
                  }}
                  sx={{ cursor: 'pointer', opacity: device.traits.includes(trait) ? 1 : 0.6 }}
                />
              ))}
            </div>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={device.willReportState}
                  onChange={(e) => setDevice({ ...device, willReportState: e.target.checked })}
                  color="primary"
                />
              }
              label="Will Report State (proactive state reporting)"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={device.metaStateOn}
                  onChange={(e) => setDevice({ ...device, metaStateOn: e.target.checked })}
                  color="primary"
                />
              }
              label="Initial State: On"
            />
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            {onBack ? (
              <Button
                type="button"
                variant="text"
                onClick={onBack}
                startIcon={<ArrowBack />}
                sx={{
                  color: 'rgba(244,247,239,.62)',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'rgba(244,247,239,.06)', boxShadow: 'none' },
                }}
              >
                Back to devices
              </Button>
            ) : <span />}
            <Button type="submit" variant="contained" disabled={submitting} sx={{ minWidth: { xs: 150, sm: 240 } }}>
              {submitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Device' : 'Create Device')}
            </Button>
          </Box>
        </form>
        {isEditing ? (
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 2, textAlign: 'right', opacity: 0.7 }}>
            Device ID: {existingDevice?.deviceId}
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 2, textAlign: 'right', opacity: 0.7 }}>
            The server will generate a unique deviceId.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
