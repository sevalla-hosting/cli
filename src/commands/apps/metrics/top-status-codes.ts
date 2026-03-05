import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const topStatusCodesCommand = makeMetricsCommand({
  name: 'top-status-codes',
  description: 'Get application top status codes',
  label: 'Top Status Codes',
  apiCall: (client, id, query) => client.get(`/applications/${id}/metrics/top-status-codes`, query),
});
