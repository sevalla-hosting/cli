import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const cpuLimitCommand = makeMetricsCommand({
  name: 'cpu-limit',
  description: 'Get database CPU limit metrics',
  label: 'CPU Limit',
  apiCall: (client, id, query) => client.get(`/databases/${id}/metrics/cpu-limit`, query),
});
