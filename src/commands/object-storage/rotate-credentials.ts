import { makeActionCommand } from '../../helpers/command-factory.ts';

export const objectStorageRotateCredentialsCommand = makeActionCommand<Record<string, unknown>>({
  name: 'rotate-credentials',
  description: 'Rotate access and secret keys for an object storage bucket',
  options: [
    {
      flags: '--old-keys-ttl-hours <hours>',
      description:
        'Keep previous keys valid for this many hours (0-168). 0 invalidates immediately. Defaults to 0.',
    },
  ],
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['oldKeysTtlHours'] !== undefined) {
      body['old_keys_ttl_hours'] = Number(opts['oldKeysTtlHours']);
    }
    return client.post(`/object-storage/${id}/rotate-credentials`, body);
  },
  successMessage:
    'Credentials rotated. Capture the new access_key and secret_key from the response — they are not retrievable later.',
  spinnerText: 'Rotating credentials...',
  displayFields: (item) => ({
    ID: item['id'],
    'Display Name': item['display_name'],
    'New Access Key': item['access_key'],
    'New Secret Key': item['secret_key'],
    'Previous Access Key': item['old_access_key'],
    'Previous Secret Key': item['old_secret_key'],
    'Previous Keys Expire At': item['old_keys_expired_at'],
  }),
});
