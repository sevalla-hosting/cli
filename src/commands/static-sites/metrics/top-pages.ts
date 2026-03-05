import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const topPagesCommand = makeMetricsCommand({
  name: 'top-pages',
  description: 'Get static site top pages',
  label: 'Top Pages',
  apiCall: (client, id, query) => client.get(`/static-sites/${id}/metrics/top-pages`, query),
});
