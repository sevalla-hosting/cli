import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const storageLimitCommand = makeMetricsCommand({
  name: 'storage-limit',
  description: 'Get database storage limit metrics',
  label: 'Storage Limit',
  apiCall: (client, id, query) => client.get(`/databases/${id}/metrics/storage-limit`, query),
});
