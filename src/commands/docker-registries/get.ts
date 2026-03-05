import { makeGetCommand } from '../../helpers/command-factory.ts';

export const dockerRegistriesGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get Docker registry details',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['name'],
    URL: item['url'],
    'Created At': item['created_at'],
  }),
  apiCall: (client, id) => client.get(`/docker-registries/${id}`),
});
