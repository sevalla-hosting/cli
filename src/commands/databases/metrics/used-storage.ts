import { makeGetCommand } from '../../../helpers/command-factory.ts';

export const usedStorageCommand = makeGetCommand({
  name: 'used-storage',
  description: 'Get database used storage metric',
  displayFields: (item: { value: number }) => ({ 'Used Storage': item.value }),
  apiCall: (client, id) => client.get(`/databases/${id}/metrics/used-storage`),
});
