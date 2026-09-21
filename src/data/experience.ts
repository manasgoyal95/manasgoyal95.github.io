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
      'Designed and implemented a multi-currency virtual credit card (VCC) system enabling cross-border B2B travel payments across 31 currencies, integrating Citi, Wex and CXP through a pluggable connector/factory architecture with rule-based provider routing.',
      'Built a multi-currency digital wallet backed by a double-entry ledger guaranteeing transactional consistency across top-ups, transfers, funding and refunds, with multiple payment methods and FX-based conversion.',
      'Built an event-driven webhook pipeline on Azure Service Bus with queue consumers, retry handling, idempotency checks, audit reporting and dead-letter recovery — 99% delivery reliability.',
      'Developed a standalone Go reporting service producing PDF/XLSX/CSV financial reports with cron-scheduled, timezone-aware email delivery and paginated batch processing over PostgreSQL.',
      'Single-handedly designed and built an org-wide email notification microservice (Go, Gin, PostgreSQL) adopted by every team: dynamic templates, multi-language fallback, SendGrid/SMTP with retries, encrypted PDF generation on Azure Blob Storage.',
    ],
    stack: ['Go', 'PostgreSQL', 'Azure Service Bus', 'Azure Blob', 'Docker', 'New Relic', 'Elasticsearch'],
  },
  {
    company: 'NorthLadder',
    role: 'Software Engineering Intern',
    start: 'Dec 2023',
    end: 'May 2024',
    summary:
      'Built the payment and payout service for a marketplace: collect buyer funds, hold against an order, disburse to sellers — every movement on a double-entry ledger.',
    bullets: [
      'Built a payment and payout microservice recording every money movement on a PostgreSQL double-entry ledger with balanced debit/credit pairs for full auditability.',
      'Designed idempotent payment APIs using unique-constrained, client-supplied idempotency keys and row-level locking on balances, eliminating duplicate charges and lost-update races.',
      'Modeled payment and payout lifecycles as explicit state machines (pending → authorized → captured → settled), releasing payouts only after capture, with retries for failed disbursements.',
      'Integrated an external payment gateway via asynchronous webhooks with idempotent, out-of-order-safe handlers, plus a cron-driven settlement worker meeting a 48-hour SLA using job cursors to prevent double payment.',
    ],
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Webhooks', 'Cron'],
  },
];

export const education = {
  school: 'Indian Institute of Information Technology, Nagpur',
  degree: 'B.Tech — Electronics & Communication',
  start: 'Dec 2020',
  end: 'May 2024',
  note: 'CGPA 7.99',
};
