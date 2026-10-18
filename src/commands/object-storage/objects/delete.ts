import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const objectsDeleteCommand = makeActionCommand({
  name: 'delete',
  description: 'Delete objects from a bucket',
  idArg: 'bucket-id',
  options: [
    {
      flags: '--keys <keys>',
      description: 'Comma-separated object keys to delete',
      required: true,
    },
  ],
  apiCall: (client, id, opts) =>
    client.delete(`/object-storage/${id}/objects`, { keys: (opts['keys'] as string).split(',') }),
  successMessage: 'Objects deleted.',
});
