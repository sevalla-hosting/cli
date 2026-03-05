import { makeActionCommand } from '../../../helpers/command-factory.ts';

export const domainsAddCommand = makeActionCommand({
  name: 'add',
  description: 'Add a domain to a static site',
  idArg: 'site-id',
  options: [{ flags: '--name <name>', description: 'Domain name', required: true }],
  apiCall: (client, id, opts) => client.post(`/static-sites/${id}/domains`, { name: opts['name'] }),
  successMessage: 'Domain added.',
});
