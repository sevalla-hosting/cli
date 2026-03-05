import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const responseTimeCommand = makeMetricsCommand({
  name: 'response-time',
  description: 'Get application response time',
  label: 'Response Time',
  apiCall: (client, id, query) => client.get(`/applications/${id}/metrics/response-time`, query),
});
