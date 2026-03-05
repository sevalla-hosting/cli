import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const statusCodesCommand = makeMetricsCommand({
  name: 'status-codes',
  description: 'Get static site status code breakdown',
  label: 'Status Codes',
  apiCall: (client, id, query) => client.get(`/static-sites/${id}/metrics/status-codes`, query),
});
