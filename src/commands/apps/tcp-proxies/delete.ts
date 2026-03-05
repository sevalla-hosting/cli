import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const tcpProxiesDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete a TCP proxy',
  parentIdName: 'app-id',
  childIdName: 'tcp-proxy-id',
  apiCall: (client, parentId, childId) =>
    client.delete(`/applications/${parentId}/tcp-proxies/${childId}`),
  successMessage: 'TCP proxy deleted.',
});
