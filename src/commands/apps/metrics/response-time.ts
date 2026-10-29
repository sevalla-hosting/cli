import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const responseTimeCommand = makeMetricsCommand({
  name: 'response-time',
  description: 'Get application response time',
  label: 'Response Time',
  options: [
    { flags: '--percent <number>', description: 'Percentile to return, 1-99 (e.g. 95 for p95)' },
  ],
  apiCall: (client, id, query, opts) =>
    client.get(`/applications/${id}/metrics/response-time`, {
      ...query,
      percent: opts['percent'] as string | undefined,
    }),
});
