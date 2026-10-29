import { makeActionCommand } from '../../helpers/command-factory.ts';

export const objectStoragePurgeCacheCommand = makeActionCommand({
  name: 'purge-cache',
  description: "Purge the cache of a bucket's CDN domain",
  apiCall: (client, id) => client.post(`/object-storage/${id}/cache/purge`),
  successMessage: 'CDN cache purged.',
  spinnerText: 'Purging cache...',
});
