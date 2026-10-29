import { makeGetCommand } from '../../../helpers/command-factory.ts';

export const maintenanceModeGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get the maintenance mode of an application',
  idArg: { name: 'app-id', description: 'Application ID' },
  displayFields: (item: Record<string, unknown>) => ({
    Enabled: item['is_enabled'],
    'Page URL': item['page_url'] ?? '(default Sevalla page)',
  }),
  apiCall: (client, id) => client.get(`/applications/${id}/maintenance-mode`),
});
