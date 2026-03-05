import { makeActionCommand } from '../../helpers/command-factory.ts';

export const staticSitesPurgeCacheCommand = makeActionCommand({
  name: 'purge-cache',
  description: 'Purge edge cache for a static site',
  apiCall: (client, id) => client.post(`/static-sites/${id}/purge-cache`),
  successMessage: 'Edge cache purged.',
  spinnerText: 'Purging cache...',
});
