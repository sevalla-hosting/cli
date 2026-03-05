import { makeActionCommand } from '../../helpers/command-factory.ts';

export const appsCdnToggleCommand = makeActionCommand({
  name: 'cdn-toggle',
  description: 'Toggle CDN for an application',
  apiCall: (client, id) => client.post(`/applications/${id}/cdn/toggle`),
  successMessage: 'CDN toggled.',
  spinnerText: 'Toggling CDN...',
});
