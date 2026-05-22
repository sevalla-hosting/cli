import { makeUpdateCommand } from '../../helpers/command-factory.ts';

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

export const usageAlertsUpdateCommand = makeUpdateCommand({
  name: 'update',
  description: 'Update a usage alert config',
  apiPath: '/usage-alerts',
  options: [
    { flags: '--limit-usd <amount>', description: 'New spending limit in USD' },
    { flags: '--emails <list>', description: 'Comma-separated email recipients' },
    {
      flags: '--triggers <list>',
      description:
        'Comma-separated trigger percentages, e.g. "50,80,100". Replaces all existing triggers.',
    },
  ],
  displayFields: (item: Record<string, unknown>) => ({
    ID: item['id'],
    'Limit (USD)': item['limit_usd'],
    Emails: ((item['emails'] as string[] | undefined) ?? []).join(', '),
    Triggers: ((item['triggers'] as Array<{ percentage: number }> | undefined) ?? [])
      .map((t) => `${t.percentage}%`)
      .join(', '),
  }),
  apiCall: (client, id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts['limitUsd'] !== undefined) body['limit_usd'] = Number(opts['limitUsd']);
    if (opts['emails'] !== undefined) body['emails'] = parseList(opts['emails']);
    if (opts['triggers'] !== undefined) body['triggers'] = parsePercentages(opts['triggers']);
    return client.patch(`/usage-alerts/${id}`, body);
  },
});
