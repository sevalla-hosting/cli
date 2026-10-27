import { makeListCommand } from '../../helpers/command-factory.ts';

export const resourcesDiskTypesCommand = makeListCommand<{
  id: string;
  name: string;
  size_gib: number;
}>({
  name: 'disk-types',
  description: 'List available disk resource types',
  columns: [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Size (GiB)', key: 'size_gib' },
  ],
  apiCall: (client) => client.get('/resources/disk-resource-types'),
  paginated: false,
});
