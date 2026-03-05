import { makeGetCommand } from '../../../helpers/command-factory.ts';

export const ipRestrictionGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get IP restriction rules',
  idArg: { name: 'db-id', description: 'Database ID' },
  displayFields: (item: Record<string, unknown>) => item,
  apiCall: (client, id) => client.get(`/databases/${id}/ip-restriction`),
});
