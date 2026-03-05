import { makeActionCommand } from '../../helpers/command-factory.ts';

export const appsSuspendCommand = makeActionCommand({
  name: 'suspend',
  description: 'Suspend an application',
  apiCall: (client, id) => client.post(`/applications/${id}/suspend`),
  successMessage: 'Application suspended.',
  spinnerText: 'Suspending application...',
});
