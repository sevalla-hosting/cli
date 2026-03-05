import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const responseTimeAvgCommand = makeMetricsCommand({
  name: 'response-time-avg',
  description: 'Get static site average response time',
  label: 'Average Response Time',
  apiCall: (client, id, query) =>
    client.get(`/static-sites/${id}/metrics/response-time-avg`, query),
});
