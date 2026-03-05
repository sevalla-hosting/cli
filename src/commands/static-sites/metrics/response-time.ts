import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const responseTimeCommand = makeMetricsCommand({
  name: 'response-time',
  description: 'Get static site response time',
  label: 'Response Time',
  apiCall: (client, id, query) => client.get(`/static-sites/${id}/metrics/response-time`, query),
});
