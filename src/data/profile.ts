export const profile = {
  name: 'Manas Goyal',
  role: 'Software Engineer',
  company: 'iOL World',
  location: 'India',
  tagline:
    'Backend engineer building reliable, high-throughput distributed systems in Go — currently the payments and wallet platform at iOL World.',
  summary:
    'The domain so far has been fintech; the problems — consistency under concurrency, idempotent APIs, event-driven pipelines, observability — apply to any system that has to be correct at scale.',
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
