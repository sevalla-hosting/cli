import { makeUpdateCommand } from '../../helpers/command-factory.ts';

export const pipelinesUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update a pipeline',
  options: [{ flags: '--name <name>', description: 'Pipeline name' }],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    Name: item['display_name'],
    Status: item['status'],
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['name']) body['display_name'] = opts['name'];
    return client.patch(`/pipelines/${id}`, body);
  },
});
