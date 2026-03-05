import { makeListCommand } from '../../../helpers/command-factory.ts';

export const corsPoliciesListCommand = makeListCommand({
  name: 'list',
  description: 'List CORS policies',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Origins', key: 'origins' },
    { header: 'Methods', key: 'methods' },
    { header: 'Headers', key: 'headers' },
  ],
  apiCall: (client, opts) => client.get(`/object-storage/${opts['bucketId']}/cors-policies`),
  parentIdFlag: { name: 'bucket-id', description: 'Bucket ID' },
});
