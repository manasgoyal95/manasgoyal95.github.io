export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  org: string;
  period: string;
  featured?: boolean;
  tags: string[];
  summary: string;
  /** Simple left-to-right flow rendered as chips with arrows. */
  flow: string[];
  context: string;
  built: string[];
  decisions: { title: string; body: string }[];
  impact: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: 'virtual-credit-cards',
    title: 'Multi-currency virtual credit card platform',
    subtitle: 'Cross-border B2B travel payments across 31 currencies and seven card-issuing providers.',
    org: 'iOL World',
    period: '2024 — present',
    featured: true,
    tags: ['Go', 'PostgreSQL', 'Provider integrations', 'Factory pattern'],
    summary:
      'Designed the VCC issuing system that lets businesses create, fund, modify and cancel virtual cards, routing each card to the right issuing provider — Citi, CXP, Wex, Checkout.com, Revolut, TripLink or Mastercard ICCP — by rule.',
    flow: ['Client API', 'Validation & auth', 'Routing rules', 'Provider connector', 'Issuer (Citi · CXP · Wex · CKO · Revolut · TripLink · ICCP)', 'Ledger & audit'],
    context:
      'Travel businesses pay suppliers in dozens of currencies and need a fresh card per booking: single-use, capped at the booking amount, valid for a window. Each card network / issuing bank exposes a different API, different currency coverage and different failure modes — and the product needed to add providers without rewriting the core.',
    built: [
      'A pluggable connector architecture: every provider implements one Go interface (issue, fund, modify, cancel, fetch) and a factory selects the implementation at runtime.',
      'Rule-based provider routing driven by currency, amount, client configuration and provider health, so operations can change routing without a deploy.',
      'Full card lifecycle — issue, fund, modify limits/dates, cancel, reissue — with each transition persisted and auditable.',
      'REST APIs with strict JSON contracts consumed by the booking platform and internal portals.',
    ],
    decisions: [
      {
        title: 'Interface + factory over per-provider branches',
        body: 'Provider-specific logic is confined to its connector; the orchestration layer never knows which issuer it is talking to. Adding a provider is a new package plus a routing rule.',
      },
      {
        title: 'Resilience at the call boundary',
        body: 'Issuer calls are wrapped with configurable timeouts, retries with backoff and circuit breakers so a slow provider degrades gracefully instead of taking the API down.',
      },
      {
        title: 'Every money-affecting action is idempotent',
        body: 'Client-supplied idempotency keys and unique constraints ensure a retried "issue card" never produces two cards or two fundings.',
      },
    ],
    impact: [
      'Live across 31 currencies with seven integrated issuing providers, including failover between providers when one is unavailable.',
      'Part of a platform serving ~1M requests/day.',
      'New providers onboard as a self-contained connector without changes to the core flow.',
    ],
  },
  {
    slug: 'wallet-ledger',
    title: 'Multi-currency wallet on a double-entry ledger',
    subtitle: 'Top-ups, transfers, card funding and refunds with guaranteed transactional consistency.',
    org: 'iOL World',
    period: '2024 — present',
    featured: true,
    tags: ['Go', 'PostgreSQL', 'Double-entry ledger', 'FX'],
    summary:
      'Built the wallet platform that holds client balances in multiple currencies and funds virtual cards, with every movement recorded as balanced debit/credit postings.',
    flow: ['Top-up / transfer request', 'Idempotency check', 'DB transaction', 'Debit + credit postings', 'Balance update', 'Statement'],
    context:
      'A payments platform cannot afford a balance that disagrees with its history. Wallets needed to support several funding methods, FX conversion between currencies, and refunds that reverse cleanly — all under concurrent requests from the card-issuing flow.',
    built: [
      'A double-entry ledger where each operation writes a balanced pair of postings inside one database transaction; balances are derived, never blindly overwritten.',
      'Wallet operations: top-up (multiple payment methods), wallet-to-wallet transfer, card funding, refunds and manual adjustments.',
      'FX-based conversion with markup handling for cross-currency movements.',
      'Statement generation from the ledger, so what the customer sees is exactly what was posted.',
    ],
    decisions: [
      {
        title: 'Row-level locks on balances',
        body: 'Concurrent fundings against the same wallet serialize on the balance row (SELECT … FOR UPDATE), which eliminated lost-update races without an external lock service.',
      },
      {
        title: 'Reversal, not deletion',
        body: 'A refund is a new pair of postings that mirrors the original. Nothing is ever mutated or removed, which keeps audit and reconciliation trivial.',
      },
      {
        title: 'Keep the ledger boring',
        body: 'Business rules live in the service layer; the ledger only knows accounts, postings and invariants. That made it reusable across the legacy and the new issuing-side wallets.',
      },
    ],
    impact: [
      'Balances provably reconcile to posting history.',
      'Supports multi-currency operations with FX conversion for cross-border payments.',
      'The same ledger core powers wallet statements and financial reporting.',
    ],
  },
  {
    slug: 'webhook-pipeline',
    title: 'Event-driven webhook processing pipeline',
    subtitle: 'Provider notifications on Azure Service Bus with retries, idempotency and DLQ recovery.',
    org: 'iOL World',
    period: '2024 — present',
    featured: true,
    tags: ['Go', 'Azure Service Bus', 'Queues', 'Idempotency'],
    summary:
      'Built the pipeline that ingests authorization, settlement and refund events from seven card providers and reconciles them against internal ledgers — reliably, in order, exactly once.',
    flow: ['Provider webhook', 'Ingest & persist', 'Service Bus queue', 'Consumer workers', 'Idempotent handler', 'Ledger reconciliation'],
    context:
      'Card issuers push events (authorizations, clearings, declines, refunds) over HTTP. They retry aggressively, deliver out of order, and occasionally send the same event twice. Processing had to be decoupled from ingestion so a spike or a downstream failure never lost an event.',
    built: [
      'A thin ingest endpoint that validates, persists the raw event and enqueues it — acknowledging the provider fast.',
      'Queue consumers on Azure Service Bus with bounded concurrency, structured retries and dead-letter handling.',
      'Idempotency keyed on provider event IDs, plus out-of-order-safe handlers that reconcile against the current internal state.',
      'Audit reporting on every processed event and a DLQ recovery path for replaying poison messages after a fix.',
    ],
    decisions: [
      {
        title: 'Persist before enqueue',
        body: 'The raw payload is stored before anything else. If the queue or the consumer misbehaves, the event can always be replayed from the source of truth.',
      },
      {
        title: 'Treat the DLQ as a feature',
        body: 'Poison messages are expected. A recovery job re-drives dead-lettered events on demand, turning incidents into a five-minute operation instead of manual data surgery.',
      },
      {
        title: 'Observability first',
        body: 'Every hop emits structured logs and New Relic traces keyed by event ID, so a support question ("did we get the settlement for card X?") is a single search.',
      },
    ],
    impact: [
      '99% delivery reliability for provider events.',
      'Ingestion decoupled from processing — provider spikes no longer affect API latency.',
      'Audit trail on every event for finance and support.',
    ],
  },
  {
    slug: 'notification-service',
    title: 'Org-wide email notification microservice',
    subtitle: 'A shared service every team adopted, built solo from design to production.',
    org: 'iOL World',
    period: '2025',
    tags: ['Go', 'Gin', 'PostgreSQL', 'SendGrid', 'Azure Blob'],
    summary:
      'Designed and built the company’s notification service: templated, multi-language emails with attachments, delivered through SendGrid or SMTP with automatic retries.',
    flow: ['Producer service', 'REST API', 'Template render', 'PDF generate & encrypt', 'SendGrid / SMTP', 'Delivery log'],
    context:
      'Several services were each sending email their own way, with inconsistent templates and no retry or audit story. The goal was a single, versioned API any team could call.',
    built: [
      'Gin-based REST API with versioning, backed by PostgreSQL for templates, requests and delivery state.',
      'Dynamic template rendering with per-language variants and automatic fallback to a default locale.',
      'Encrypted PDF generation stored on Azure Blob Storage and attached to outgoing mail.',
      'Pluggable delivery via SendGrid or SMTP with automatic retries and delivery tracking.',
    ],
    decisions: [
      {
        title: 'Templates as data, not code',
        body: 'Teams manage their own templates and locales through the API; the service never needs a deploy to change copy.',
      },
      {
        title: 'Deliverability is a queue problem',
        body: 'Sends are persisted first and retried with backoff; a provider outage delays mail but never drops it.',
      },
    ],
    impact: ['Adopted by every engineering team in the organisation.', 'One audit trail for all outbound email.'],
  },
  {
    slug: 'reporting-service',
    title: 'Financial reporting service',
    subtitle: 'Scheduled PDF / XLSX / CSV reports over large PostgreSQL datasets.',
    org: 'iOL World',
    period: '2025',
    tags: ['Go', 'PostgreSQL', 'Cron', 'PDF / XLSX'],
    summary:
      'A standalone Go service that generates VCC summaries, order reports and wallet statements, delivered on schedule in the user’s timezone.',
    flow: ['Report definition', 'Scheduler (cron, tz-aware)', 'Paginated query', 'Render PDF / XLSX / CSV', 'Email delivery', 'Run history'],
    context:
      'Finance and operations users needed recurring exports over months of transaction data. Naïve "select everything" exports timed out and exhausted memory, and schedules had to respect each organisation’s local time.',
    built: [
      'Report definitions with filters, columns and output options, stored in the service’s own database and queried read-only against wallet data.',
      'A timezone-aware scheduler and a separate worker binary so heavy exports run off the API path.',
      'Paginated batch processing with cursors so multi-hundred-thousand-row exports stream to disk in bounded memory.',
      'Renderers for PDF, XLSX and CSV plus emailed delivery and per-run history.',
    ],
    decisions: [
      {
        title: 'Separate server and worker binaries',
        body: 'Same codebase, two entrypoints. The API stays responsive while workers scale independently for month-end load.',
      },
      {
        title: 'Cursor pagination over OFFSET',
        body: 'Keyset pagination keeps each page cheap regardless of how deep into the dataset an export is.',
      },
    ],
    impact: ['Large exports run in bounded memory.', 'Reports arrive on schedule in each organisation’s timezone.'],
  },
  {
    slug: 'pulse-realtime-chat',
    title: 'Pulse — realtime chat',
    subtitle: 'Go + WebSockets + React, deployed as a single binary with live presence and typing indicators.',
    org: 'Personal',
    period: '2026',
    tags: ['Go', 'WebSockets', 'React', 'TypeScript', 'SQLite'],
    summary:
      'A take-home turned side project: link-is-access chat rooms with persistence, presence, typing indicators and reconnect-with-replay — shipped as one static Go binary.',
    flow: ['Browser', 'WebSocket /ws', 'Room hub (Go)', 'SQLite (pure Go)', 'Broadcast', 'Other clients'],
    context:
      'The brief left most decisions open, so the decisions became the deliverable: what to persist, how identity works, how rooms are scoped, and how to keep deployment to a single artifact.',
    built: [
      'Go backend with gorilla/websocket, a per-room hub, and SQLite via a pure-Go driver (no CGO → static binary, distroless container).',
      'React 18 + TypeScript + Tailwind frontend embedded into the binary with go:embed — one service, one URL, no CORS.',
      'Live presence and typing indicators, throttled on the client and auto-expired on the server.',
      'Reconnect handling with missed-message replay for the current room.',
    ],
    decisions: [
      {
        title: 'Per-URL rooms, link is access',
        body: 'The Figma/Miro model: the slug is the conversation. No accounts, no create/join/list UI.',
      },
      {
        title: 'Single binary deploy',
        body: 'Serving the SPA and the WebSocket endpoint from one process removed an entire class of split-origin problems.',
      },
    ],
    impact: ['Live demo and full write-up of every trade-off in the README.'],
    links: [
      { label: 'Source on GitHub', href: 'https://github.com/manasgoyal95/realtime-chat' },
      { label: 'Live demo', href: 'https://pulse-chat-7puv.onrender.com' },
    ],
  },
];
