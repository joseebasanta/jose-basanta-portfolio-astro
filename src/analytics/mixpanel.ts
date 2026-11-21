const token = import.meta.env.PUBLIC_MIXPANEL_TOKEN?.trim();
const region = import.meta.env.PUBLIC_MIXPANEL_REGION?.trim().toUpperCase() || 'US';
const apiHosts: Record<string, string> = {
  US: 'https://api-js.mixpanel.com',
  EU: 'https://api-eu.mixpanel.com',
  IN: 'https://api-in.mixpanel.com',
};

let client:
  Promise<typeof import('mixpanel-browser/dist/mixpanel-core.cjs.js').default> | undefined;

export function trackPortfolioEvent(
  event: 'Page Viewed' | 'Project Opened',
  properties: Record<string, string> = {},
) {
  const apiHost = apiHosts[region];
  if (!import.meta.env.PROD || !token || !apiHost) return;
  if (
    navigator.doNotTrack === '1' ||
    ('globalPrivacyControl' in navigator && navigator.globalPrivacyControl === true)
  )
    return;

  client ??= import('mixpanel-browser/dist/mixpanel-core.cjs.js').then(({ default: mixpanel }) => {
    const config = {
      api_host: apiHost,
      api_payload_format: 'json',
      autocapture: false,
      track_pageview: false,
      record_sessions_percent: 0,
      persistence: 'localStorage',
      disable_cookie: true,
      save_referrer: false,
      track_marketing: false,
      store_google: false,
      ip: false,
      property_blacklist: ['$current_url', '$referrer', '$referring_domain', '$search_keyword'],
    } satisfies NonNullable<Parameters<typeof mixpanel.init>[1]> & { track_marketing: boolean };
    mixpanel.init(token, config);
    return mixpanel;
  });

  const pagePath = window.location.pathname;
  void client
    .then((mixpanel) => mixpanel.track(event, { ...properties, page_path: pagePath }))
    .catch(() => {
      // Analytics must not interfere with browsing the portfolio.
    });
}
