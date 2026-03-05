import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const slowestRequestsCommand = makeMetricsCommand({
  name: 'slowest-requests',
  description: 'Get static site slowest requests',
  label: 'Slowest Requests',
  apiCall: (client, id, query) => client.get(`/static-sites/${id}/metrics/slowest-requests`, query),
});
