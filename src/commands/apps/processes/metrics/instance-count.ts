import { makeMetricsCommand } from '../../../../helpers/command-factory.ts';

export const instanceCountCommand = makeMetricsCommand({
  name: 'instance-count',
  description: 'Get process instance count metrics',
  label: 'Instance Count',
  parentIds: ['app-id', 'process-id'],
  apiCall: (client, compositeId, query) => {
    const [appId, processId] = compositeId.split('/');
    return client.get(
      `/applications/${appId}/processes/${processId}/metrics/instance-count`,
      query,
    );
  },
});
