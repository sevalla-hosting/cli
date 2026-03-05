import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const topCountriesCommand = makeMetricsCommand({
  name: 'top-countries',
  description: 'Get static site top countries',
  label: 'Top Countries',
  apiCall: (client, id, query) => client.get(`/static-sites/${id}/metrics/top-countries`, query),
});
