import { makeGetCommand } from '../../helpers/command-factory.ts';

export const appsEgressIpsCommand = makeGetCommand<{ egress_ips: string[] }>({
  name: 'egress-ips',
  description: 'List the IP addresses outbound traffic from an application comes from',
  idArg: { name: 'app-id', description: 'Application ID' },
  displayFields: (item) => ({ 'Egress IPs': item.egress_ips.join('\n') }),
  apiCall: (client, id) => client.get(`/applications/${id}/egress-ips`),
});
