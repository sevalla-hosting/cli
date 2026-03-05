import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const cdnDomainDisableCommand = makeActionCommand({
  name: 'disable',
  description: 'Disable CDN domain for object storage',
  idArg: 'bucket-id',
  apiCall: (client, id) => client.delete(`/object-storage/${id}/domain`),
  successMessage: 'CDN domain disabled.',
});
