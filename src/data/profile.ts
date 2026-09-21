export const profile = {
  name: 'Manas Goyal',
  role: 'Software Engineer',
  company: 'iOL World',
  location: 'India',
  tagline:
    'I build the backend systems that move money — virtual card issuing, multi-currency wallets, and event-driven pipelines in Go.',
  summary:
    'Backend-focused engineer with 2 years building payment, wallet and financial-transaction systems in Golang and Node.js. I care about transactional consistency, idempotency and production observability — the unglamorous parts that make money movement safe at scale.',
  email: 'manasgoyal95@gmail.com',
  resumeUrl: '/Manas_Goyal_Resume.pdf',
  links: {
    github: 'https://github.com/manasgoyal95',
    linkedin: 'https://www.linkedin.com/in/manas-goyal-242656206/',
    leetcode: 'https://leetcode.com/manasgoyal95/',
    codeforces: 'https://codeforces.com/profile/manasgoyal95',
    codechef: 'https://www.codechef.com/users/goyal_manas',
  },
  stats: [
    { value: '~1M', label: 'requests / day served' },
    { value: '31', label: 'currencies supported' },
    { value: '99%', label: 'webhook delivery reliability' },
    { value: '7', label: 'card-issuing providers integrated' },
  ],
} as const;
