import { makeActionCommand } from '../../helpers/command-factory.ts';

export const appsPurgeCacheCommand = makeActionCommand({
  name: 'purge-cache',
  description: 'Purge edge cache for an application',
  apiCall: (client, id) => client.post(`/applications/${id}/purge-cache`),
  successMessage: 'Edge cache purged.',
  spinnerText: 'Purging cache...',
});
