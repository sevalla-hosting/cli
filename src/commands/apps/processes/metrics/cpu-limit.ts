import { makeMetricsCommand } from '../../../../helpers/command-factory.ts';

export const cpuLimitCommand = makeMetricsCommand({
  name: 'cpu-limit',
  description: 'Get process CPU limit metrics',
  label: 'CPU Limit',
  parentIds: ['app-id', 'process-id'],
  apiCall: (client, compositeId, query) => {
    const [appId, processId] = compositeId.split('/');
    return client.get(`/applications/${appId}/processes/${processId}/metrics/cpu-limit`, query);
  },
});
