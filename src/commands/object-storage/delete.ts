import { makeDeleteCommand } from '../../helpers/command-factory.ts';

export const objectStorageDeleteCommand = makeDeleteCommand({
  name: 'delete',
  description: 'Delete an object storage bucket',
  apiCall: (client, id) => client.delete(`/object-storage/${id}`),
  successMessage: 'Object storage bucket deleted.',
});
