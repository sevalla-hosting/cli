import { makeMetricsCommand } from '../../../helpers/command-factory.ts';

export const responseTimeCommand = makeMetricsCommand({
  name: 'response-time',
  description: 'Get static site response time',
  label: 'Response Time',
  options: [
    { flags: '--percent <number>', description: 'Percentile to return, 1-99 (e.g. 95 for p95)' },
  ],
  apiCall: (client, id, query, opts) =>
    client.get(`/static-sites/${id}/metrics/response-time`, {
      ...query,
      percent: opts['percent'] as string | undefined,
    }),
});
