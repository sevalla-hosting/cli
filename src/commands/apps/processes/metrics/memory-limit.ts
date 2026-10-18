import { makeMetricsCommand } from '../../../../helpers/command-factory.ts';

export const memoryLimitCommand = makeMetricsCommand({
  name: 'memory-limit',
  description: 'Get process memory limit metrics',
  label: 'Memory Limit',
  parentIds: ['app-id', 'process-id'],
  apiCall: (client, compositeId, query) => {
    const [appId, processId] = compositeId.split('/');
    return client.get(`/applications/${appId}/processes/${processId}/metrics/memory-limit`, query);
  },
});
