import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const memoryLimitCommand = makeMetricsCommand({
  name: 'memory-limit',
  description: 'Get database memory limit metrics',
  label: 'Memory Limit',
  apiCall: (client, id, query) => client.get(`/databases/${id}/metrics/memory-limit`, query),
});
