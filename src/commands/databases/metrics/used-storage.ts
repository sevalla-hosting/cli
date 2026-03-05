import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const usedStorageCommand = makeMetricsCommand({
  name: 'used-storage',
  description: 'Get database used storage metrics',
  label: 'Used Storage',
  apiCall: (client, id, query) => client.get(`/databases/${id}/metrics/used-storage`, query),
});
