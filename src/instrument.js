// import { useEffect } from "react";
import * as Sentry from "@sentry/react";


Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN, // ops, i leaked the previous one :)
  integrations: [
    // See docs for support of different versions of variation of react router
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    // Sentry.reactRouterV6BrowserTracingIntegration({
    //   useEffect,
    // }),
    Sentry.replayIntegration(),
  ],
  // Set release to the version of the aplication as defined in package.json in the "version" field
  release: process.env.REACT_APP_VERSION,
  attachStacktrace: true,
  

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  tracePropagationTargets: [/^\//, /^https:\/\/abstractobserver\.studio/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});