import { makeGetCommand } from '../../../helpers/command-factory.ts';

export const deploymentHookGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get deployment hook URL',
  idArg: { name: 'app-id', description: 'Application ID' },
  displayFields: (item: Record<string, unknown>) => ({
    URL: item['url'],
    Enabled: item['enabled'],
  }),
  apiCall: (client, id) => client.get(`/applications/${id}/deployment-hook`),
});
