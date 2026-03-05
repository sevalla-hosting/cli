import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const responseTimeAvgCommand = makeMetricsCommand({
  name: 'response-time-avg',
  description: 'Get application average response time',
  label: 'Average Response Time',
  apiCall: (client, id, query) =>
    client.get(`/applications/${id}/metrics/response-time-avg`, query),
});
