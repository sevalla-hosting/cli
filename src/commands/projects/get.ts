import { makeGetCommand } from '../../helpers/command-factory.ts';

export const projectsGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get project details',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['name'],
    Description: item['description'],
    'Created At': item['created_at'],
  }),
  apiCall: (client, id) => client.get(`/projects/${id}`),
});
