import { makeGetCommand } from '../../helpers/command-factory.ts';

export const usageAlertsGetCommand = makeGetCommand({
  name: 'get',
  description: 'Get a usage alert config',
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    'Company ID': item['company_id'],
    'Project ID': item['project_id'],
    'Limit (USD)': item['limit_usd'],
    Emails: ((item['emails'] as string[] | undefined) ?? []).join(', '),
    Triggers: ((item['triggers'] as Array<{ percentage: number }> | undefined) ?? [])
      .map((t) => `${t.percentage}%`)
      .join(', '),
    'Created At': item['created_at'],
    'Updated At': item['updated_at'],
  }),
  apiCall: (client, id) => client.get(`/usage-alerts/${id}`),
});
