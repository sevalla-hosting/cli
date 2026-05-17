import { makeActionCommand } from '../../helpers/command-factory.ts';

interface PrettyUrlStatus {
  is_turned_on: boolean;
}

export const staticSitesPrettyUrlToggleCommand = makeActionCommand<PrettyUrlStatus>({
  name: 'pretty-url-toggle',
  description: 'Toggle pretty URL redirects for a static site',
  apiCall: (client, id) => client.post(`/static-sites/${id}/pretty-url/toggle`),
  successMessage: (result) =>
    `Pretty URLs ${result.is_turned_on ? 'enabled' : 'disabled'}.`,
  spinnerText: 'Toggling pretty URLs...',
});
