import { makeMetricsCommand } from '../../../../helpers/command-factory.ts';

export const memoryUsageCommand = makeMetricsCommand({
  name: 'memory-usage',
  description: 'Get process memory usage metrics',
  label: 'Memory Usage',
  parentIds: ['app-id', 'process-id'],
  apiCall: (client, compositeId, query) =>
    client.get(`/applications/${compositeId}/metrics/memory-usage`, query),
});
