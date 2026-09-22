export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  summary: string;
  bullets: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    company: 'iOL World',
    role: 'Software Engineer',
    start: 'Aug 2024',
    end: 'Present',
    summary:
      'Core contributor on the payments platform behind a B2B travel-payments product: VCC issuing, wallets, webhook processing, reporting and notifications.',
    bullets: [
      'Engineered secure, scalable Go microservices (REST APIs, JSON contracts) for a B2B payments platform serving ~1M requests/day, with resilient inter-service communication via retries, circuit breakers and configurable timeouts.',
      'Designed and implemented a multi-currency virtual credit card (VCC) system enabling cross-border B2B travel payments across 31 currencies, integrating seven issuing providers (Citi, CXP, Wex, Checkout.com, Revolut, TripLink, Mastercard ICCP) through a pluggable connector/factory architecture with rule-based provider routing.',
      'Built a multi-currency digital wallet backed by a double-entry ledger guaranteeing transactional consistency across top-ups, transfers, funding and refunds, with multiple payment methods and FX-based conversion.',
      'Built an event-driven webhook pipeline on Azure Service Bus with queue consumers, retry handling, idempotency checks, audit reporting and dead-letter recovery — 99% delivery reliability.',
      'Developed a standalone Go reporting service producing PDF/XLSX/CSV financial reports with cron-scheduled, timezone-aware email delivery and paginated batch processing over PostgreSQL.',
      'Single-handedly designed and built an org-wide email notification microservice (Go, Gin, PostgreSQL) adopted by every team: dynamic templates, multi-language fallback, SendGrid/SMTP with retries, encrypted PDF generation on Azure Blob Storage.',
    ],
    stack: ['Go', 'PostgreSQL', 'Azure Service Bus', 'Azure Blob', 'Docker', 'New Relic', 'Elasticsearch'],
  },
];

export const education = {
  school: 'Indian Institute of Information Technology, Nagpur',
  degree: 'B.Tech — Electronics & Communication',
  start: 'Dec 2020',
  end: 'May 2024',
  note: 'CGPA 7.99',
};
