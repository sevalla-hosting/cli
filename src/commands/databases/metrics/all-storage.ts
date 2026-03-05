import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const allStorageCommand = makeMetricsCommand({
  name: 'all-storage',
  description: 'Get database all storage metrics',
  label: 'All Storage',
  apiCall: (client, id, query) => client.get(`/databases/${id}/metrics/all-storage`, query),
});
