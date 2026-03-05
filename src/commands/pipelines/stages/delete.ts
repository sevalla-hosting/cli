import { makeSubResourceDeleteCommand } from '../../../helpers/command-factory.ts';

export const stagesDeleteCommand = makeSubResourceDeleteCommand({
  name: 'delete',
  description: 'Delete a pipeline stage',
  parentIdName: 'pipeline-id',
  childIdName: 'stage-id',
  apiCall: (client, parentId, childId) => client.delete(`/pipelines/${parentId}/stages/${childId}`),
  successMessage: 'Stage deleted.',
});
