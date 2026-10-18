import { makeActionCommand } from '../../../helpers/command-factory.ts';
import { SevallaCliError } from '../../../errors/cli-error.ts';

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
    { flags: '--confirm', description: 'Confirm deletion' },
  ],
  apiCall: (client, id, opts) => {
    if (!opts['confirm']) throw new SevallaCliError('Use --confirm to confirm deletion.');
    return client.delete(`/object-storage/${id}/objects`, {
      keys: (opts['keys'] as string).split(','),
    });
  },
  successMessage: 'Objects deleted.',
});
