import { makeGetCommand } from '../../../helpers/command-factory.ts';

export const ipRestrictionGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get IP restriction rules',
  idArg: { name: 'app-id', description: 'Application ID' },
  displayFields: (item: Record<string, unknown>) => item,
  apiCall: (client, id) => client.get(`/applications/${id}/ip-restriction`),
});
