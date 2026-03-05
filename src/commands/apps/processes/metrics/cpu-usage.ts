import { makeMetricsCommand } from '../../../../helpers/command-factory.ts';

export const cpuUsageCommand = makeMetricsCommand({
  name: 'cpu-usage',
  description: 'Get process CPU usage metrics',
  label: 'CPU Usage',
  parentIds: ['app-id', 'process-id'],
  apiCall: (client, compositeId, query) =>
    client.get(`/applications/${compositeId}/metrics/cpu-usage`, query),
});
