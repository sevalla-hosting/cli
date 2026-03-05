import { makeMetricsCommand } from '../../../../helpers/command-factory.ts';

export const instanceCountCommand = makeMetricsCommand({
  name: 'instance-count',
  description: 'Get process instance count metrics',
  label: 'Instance Count',
  parentIds: ['app-id', 'process-id'],
  apiCall: (client, compositeId, query) =>
    client.get(`/applications/${compositeId}/metrics/instance-count`, query),
});
