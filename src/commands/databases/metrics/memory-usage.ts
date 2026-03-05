import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const memoryUsageCommand = makeMetricsCommand({
  name: 'memory-usage',
  description: 'Get database memory usage metrics',
  label: 'Memory Usage',
  apiCall: (client, id, query) => client.get(`/databases/${id}/metrics/memory-usage`, query),
});
