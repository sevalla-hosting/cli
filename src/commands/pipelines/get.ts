import { makeGetCommand } from '../../helpers/command-factory.ts';

export const pipelinesGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get pipeline details',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['name'],
    Status: item['status'],
    'Created At': item['created_at'],
  }),
  apiCall: (client, id) => client.get(`/pipelines/${id}`),
});
