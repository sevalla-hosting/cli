import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const slowestRequestsCommand = makeMetricsCommand({
  name: 'slowest-requests',
  description: 'Get application slowest requests',
  label: 'Slowest Requests',
  apiCall: (client, id, query) => client.get(`/applications/${id}/metrics/slowest-requests`, query),
});
