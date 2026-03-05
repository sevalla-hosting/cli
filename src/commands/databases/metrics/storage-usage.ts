import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const storageUsageCommand = makeMetricsCommand({
  name: 'storage-usage',
  description: 'Get database storage usage metrics',
  label: 'Storage Usage',
  apiCall: (client, id, query) => client.get(`/databases/${id}/metrics/storage-usage`, query),
});
