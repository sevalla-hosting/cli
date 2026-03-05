import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const cdnDomainEnableCommand = makeActionCommand({
  name: 'enable',
  description: 'Enable CDN domain for object storage',
  idArg: 'bucket-id',
  apiCall: (client, id) => client.post(`/object-storage/${id}/domain`),
  successMessage: 'CDN domain enabled.',
});
