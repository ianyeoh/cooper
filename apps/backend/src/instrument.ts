import * as Sentry from '@sentry/node';

// Instrumentation for Sentry (error logging platform)

Sentry.init({
  dsn: 'https://c4fdc05bdc40c4922eae82cac765e637@sentry.ianyeoh.com/4',

  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
