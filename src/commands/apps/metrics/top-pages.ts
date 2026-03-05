import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const topPagesCommand = makeMetricsCommand({
  name: 'top-pages',
  description: 'Get application top pages',
  label: 'Top Pages',
  apiCall: (client, id, query) => client.get(`/applications/${id}/metrics/top-pages`, query),
});
