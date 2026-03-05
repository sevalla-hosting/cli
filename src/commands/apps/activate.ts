import { makeActionCommand } from '../../helpers/command-factory.ts';

export const appsActivateCommand = makeActionCommand({
  name: 'activate',
  description: 'Activate an application',
  apiCall: (client, id) => client.post(`/applications/${id}/activate`),
  successMessage: 'Application activated.',
  spinnerText: 'Activating application...',
});
