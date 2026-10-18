import { makeGetCommand } from '../../../helpers/command-factory.ts';

export const allStorageCommand = makeGetCommand({
  name: 'all-storage',
  description: 'Get database all storage metric',
  displayFields: (item: { value: number }) => ({ 'All Storage': item.value }),
  apiCall: (client, id) => client.get(`/databases/${id}/metrics/all-storage`),
});
