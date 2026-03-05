import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const domainsAddCommand = makeActionCommand({
  name: 'add',
  description: 'Add a domain to an application',
  idArg: 'app-id',
  options: [{ flags: '--name <name>', description: 'Domain name', required: true }],
  apiCall: (client, id, opts) => client.post(`/applications/${id}/domains`, { name: opts['name'] }),
  successMessage: 'Domain added.',
});
