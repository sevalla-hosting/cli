import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const topCountriesCommand = makeMetricsCommand({
  name: 'top-countries',
  description: 'Get application top countries',
  label: 'Top Countries',
  apiCall: (client, id, query) => client.get(`/applications/${id}/metrics/top-countries`, query),
});
