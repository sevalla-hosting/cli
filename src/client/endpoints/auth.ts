import type { ApiClient } from '../api-client.ts';

export interface DeviceCode {
  code: string;
  expires_at: string;
}

export interface DeviceCodeStatus {
  status: 'pending' | 'approved' | 'denied' | 'expired';
  token?: string;
}

export async function createDeviceCode(client: ApiClient): Promise<DeviceCode> {
  return client.post<DeviceCode>('/auth/device-codes');
}

export async function pollDeviceCode(client: ApiClient, code: string): Promise<DeviceCodeStatus> {
  return client.get<DeviceCodeStatus>(`/auth/device-codes/${code}`);
}
