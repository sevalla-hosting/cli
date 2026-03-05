import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const externalConnectionToggleCommand = makeActionCommand({
  name: 'external-toggle',
  description: 'Toggle external database connection',
  idArg: 'db-id',
  apiCall: (client, id) => client.post(`/databases/${id}/external-connection/toggle`),
  successMessage: 'External connection toggled.',
  spinnerText: 'Toggling external connection...',
});
