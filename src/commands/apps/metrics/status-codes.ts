import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const statusCodesCommand = makeMetricsCommand({
  name: 'status-codes',
  description: 'Get application status code breakdown',
  label: 'Status Codes',
  apiCall: (client, id, query) => client.get(`/applications/${id}/metrics/status-codes`, query),
});
