import { makeMetricsCommand } from '../../../../helpers/command-factory.ts';

export const cpuLimitCommand = makeMetricsCommand({
  name: 'cpu-limit',
  description: 'Get process CPU limit metrics',
  label: 'CPU Limit',
  parentIds: ['app-id', 'process-id'],
  apiCall: (client, compositeId, query) =>
    client.get(`/applications/${compositeId}/metrics/cpu-limit`, query),
});
