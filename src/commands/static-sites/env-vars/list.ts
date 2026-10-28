import { makeListCommand } from '../../../helpers/command-factory.ts';
import { envVarColumns, listEnvVars, showValuesOption } from '../../../helpers/secrets.ts';

export const envVarsListCommand = makeListCommand({
  name: 'list',
  description: 'List environment variables',
  columns: envVarColumns,
  apiCall: (client, opts) => listEnvVars(client, `/static-sites/${opts['siteId']}/env-vars`, opts),
  parentIdFlag: { name: 'site-id', description: 'Static site ID' },
}).addOption(showValuesOption());
