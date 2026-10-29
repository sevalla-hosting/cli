import { makeActionCommand } from '../../helpers/command-factory.ts';

export const appsEdgeCacheToggleCommand = makeActionCommand<{ is_turned_on: boolean }>({
  name: 'edge-cache-toggle',
  description: 'Toggle edge caching for an application',
  apiCall: (client, id) => client.post(`/applications/${id}/edge-cache/toggle`),
  successMessage: (result) => `Edge cache ${result.is_turned_on ? 'enabled' : 'disabled'}.`,
  spinnerText: 'Toggling edge cache...',
});
