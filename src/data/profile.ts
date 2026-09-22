export const profile = {
  name: 'Manas Goyal',
  role: 'Software Engineer',
  company: 'iOL World',
  location: 'India',
  /** First day of professional experience — the badge derives years from this so it never goes stale. */
  careerStart: '2024-08-01',
  tagline:
    'Backend engineer, two years into building the payments platform at iOL World — virtual card issuing, multi-currency wallets, and the event pipelines that keep them consistent.',
  /** Plain-English product context. Everything else on the site depends on this landing. */
  summary:
    'iOL World is a B2B travel-payments company: travel businesses issue a single-use virtual card for each booking and pay hotels and suppliers in the supplier’s own currency. I work on the services that issue those cards, hold the money behind them, and keep the ledger correct under concurrency.',
  email: 'manasgoyal95@gmail.com',
  resumeUrl: '/Manas_Goyal_Resume.pdf',
  links: {
    github: 'https://github.com/manasgoyal95',
    linkedin: 'https://www.linkedin.com/in/manas-goyal-242656206/',
    leetcode: 'https://leetcode.com/manasgoyal95/',
    codeforces: 'https://codeforces.com/profile/manasgoyal95',
    codechef: 'https://www.codechef.com/users/goyal_manas',
  },
  /** One framing line for the stats strip, so the numbers have a referent. */
  statsIntro:
    'Everything below was built at iOL World, most of it on one platform — the system that issues those cards and settles the money behind them. Its shape, in four numbers:',
  stats: [
    {
      value: '~1M',
      label: 'requests / day',
      note: 'served by the payments platform I build on, across issuing, wallets and reporting',
    },
    {
      value: '7',
      label: 'card issuers',
      note: 'Citi, CXP, Wex, Checkout.com, Revolut, TripLink and Mastercard ICCP — each with its own API, auth scheme and failure modes',
    },
    {
      value: '31',
      label: 'currencies',
      note: 'each needing its own FX resolution, funding path and settlement reconciliation',
    },
    {
      value: '99%',
      label: 'first-try webhook delivery',
      note: 'the remainder dead-letter and replay through a recovery consumer rather than being lost',
    },
  ],
} as const;
