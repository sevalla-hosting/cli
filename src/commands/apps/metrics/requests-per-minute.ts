import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const requestsPerMinuteCommand = makeMetricsCommand({
  name: 'requests-per-minute',
  description: 'Get application requests per minute',
  label: 'Requests Per Minute',
  apiCall: (client, id, query) =>
    client.get(`/applications/${id}/metrics/requests-per-minute`, query),
});
