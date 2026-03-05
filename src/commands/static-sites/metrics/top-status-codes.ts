import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const topStatusCodesCommand = makeMetricsCommand({
  name: 'top-status-codes',
  description: 'Get static site top status codes',
  label: 'Top Status Codes',
  apiCall: (client, id, query) => client.get(`/static-sites/${id}/metrics/top-status-codes`, query),
});
