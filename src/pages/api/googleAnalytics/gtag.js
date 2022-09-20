

// googleAnalytics/gtag.js

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_TRACKING_ID;
export const UA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_UA_TRACKING_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
  window.gtag("config", UA_TRACKING_ID, {
    page_path: url,
  });
};
// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};