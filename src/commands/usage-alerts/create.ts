import { makeCreateCommand } from '../../helpers/command-factory.ts';

function parseList(raw: unknown): string[] {
  if (raw === undefined || raw === null) return [];
  const value = String(raw).trim();
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parsePercentages(raw: unknown): Array<{ percentage: number }> {
  return parseList(raw).map((s) => {
    const n = Number(s.replace(/%$/, ''));
    if (!Number.isFinite(n)) {
      throw new Error(`Invalid trigger percentage: ${s}`);
    }
    return { percentage: n };
  });
}

export const usageAlertsCreateCommand = makeCreateCommand({
  name: 'create',
  description: 'Create a usage alert config',
  apiPath: '/usage-alerts',
  options: [
    {
      flags: '--limit-usd <amount>',
      description: 'Spending limit in USD (triggers fire as percentages of this value)',
      required: true,
    },
    {
      flags: '--emails <list>',
      description: 'Comma-separated email recipients',
      required: true,
    },
    {
      flags: '--triggers <list>',
      description: 'Comma-separated trigger percentages, e.g. "50,80,100"',
      required: true,
    },
    {
      flags: '--project-id <id>',
      description: 'Scope to a project. Omit for company-wide config.',
    },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    'Project ID': item['project_id'],
    'Limit (USD)': item['limit_usd'],
    Emails: ((item['emails'] as string[] | undefined) ?? []).join(', '),
    Triggers: ((item['triggers'] as Array<{ percentage: number }> | undefined) ?? [])
      .map((t) => `${t.percentage}%`)
      .join(', '),
  }),
  apiCall: (client, opts) => {
    const body: Record<string, unknown> = {
      limit_usd: Number(opts['limitUsd']),
      emails: parseList(opts['emails']),
      triggers: parsePercentages(opts['triggers']),
    };
    if (opts['projectId']) body['project_id'] = opts['projectId'];
    return client.post('/usage-alerts', body);
  },
  successMessage: 'Usage alert created.',
});
