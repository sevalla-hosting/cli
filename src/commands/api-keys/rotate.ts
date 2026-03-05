import { makeActionCommand } from '../../helpers/command-factory.ts';

export const apiKeysRotateCommand = makeActionCommand({
  name: 'rotate',
  description: 'Rotate an API key',
  options: [{ flags: '--ttl <hours>', description: 'Hours before old token expires (default: 0)' }],
  apiCall: (client, id, opts) =>
    client.post(`/api-keys/${id}/rotate`, {
      old_token_ttl_hours: opts['ttl'] ? Number(opts['ttl']) : 0,
    }),
  successMessage: 'API key rotated.',
});
