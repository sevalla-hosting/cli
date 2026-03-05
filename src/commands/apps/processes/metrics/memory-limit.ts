import { makeMetricsCommand } from '../../../../helpers/command-factory.ts';

export const memoryLimitCommand = makeMetricsCommand({
  name: 'memory-limit',
  description: 'Get process memory limit metrics',
  label: 'Memory Limit',
  parentIds: ['app-id', 'process-id'],
  apiCall: (client, compositeId, query) =>
    client.get(`/applications/${compositeId}/metrics/memory-limit`, query),
});
