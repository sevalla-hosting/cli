import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const cpuUsageCommand = makeMetricsCommand({
  name: 'cpu-usage',
  description: 'Get database CPU usage metrics',
  label: 'CPU Usage',
  apiCall: (client, id, query) => client.get(`/databases/${id}/metrics/cpu-usage`, query),
});
