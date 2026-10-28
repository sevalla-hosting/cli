import { makeListCommand } from '../../helpers/command-factory.ts';
import { envVarColumns, listEnvVars, showValuesOption } from '../../helpers/secrets.ts';

export const globalEnvVarsListCommand = makeListCommand({
  name: 'list',
  description: 'List all global environment variables',
  columns: envVarColumns,
  apiCall: (client, opts) => listEnvVars(client, '/applications/global-env-vars', opts),
}).addOption(showValuesOption());
