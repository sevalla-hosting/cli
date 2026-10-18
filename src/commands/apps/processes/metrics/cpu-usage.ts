import { makeMetricsCommand } from '../../../../helpers/command-factory.ts';

export const cpuUsageCommand = makeMetricsCommand({
  name: 'cpu-usage',
  description: 'Get process CPU usage metrics',
  label: 'CPU Usage',
  parentIds: ['app-id', 'process-id'],
  apiCall: (client, compositeId, query) => {
    const [appId, processId] = compositeId.split('/');
    return client.get(`/applications/${appId}/processes/${processId}/metrics/cpu-usage`, query);
  },
});
