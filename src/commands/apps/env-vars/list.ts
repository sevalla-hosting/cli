import { makeListCommand } from '../../../helpers/command-factory.ts';
import { envVarColumns, listEnvVars, showValuesOption } from '../../../helpers/secrets.ts';

export const envVarsListCommand = makeListCommand({
  name: 'list',
  description: 'List environment variables',
  columns: envVarColumns,
  apiCall: (client, opts) => listEnvVars(client, `/applications/${opts['appId']}/env-vars`, opts),
  parentIdFlag: { name: 'app-id', description: 'Application ID' },
}).addOption(showValuesOption());
