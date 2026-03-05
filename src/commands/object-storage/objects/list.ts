import { makeListCommand } from '../../../helpers/command-factory.ts';

export const objectsListCommand = makeListCommand({
  name: 'list',
  description: 'List objects in a bucket',
  columns: [
    { header: 'Key', key: 'key' },
    { header: 'Size', key: 'size' },
    { header: 'Last Modified', key: 'last_modified' },
  ],
  apiCall: (client, opts) => client.get(`/object-storage/${opts['bucketId']}/objects`),
  parentIdFlag: { name: 'bucket-id', description: 'Bucket ID' },
});
