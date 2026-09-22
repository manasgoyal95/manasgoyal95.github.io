export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  org: string;
  period: string;
  /** Honest one-liner on ownership, shown under the title. */
  role: string;
  featured?: boolean;
  tags: string[];
  summary: string;
  /** Simple left-to-right flow rendered as chips with arrows. */
  flow: string[];
  context: string;
  /** Key facts rendered as a spec table. */
  specs: { label: string; value: string }[];
  built: string[];
  decisions: { title: string; body: string }[];
  impact: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: 'webhook-pipeline',
    title: 'Provider webhook & settlement reconciliation pipeline',
    subtitle: 'Every authorization, clearing, refund and settlement from seven card providers — ingested once, processed reliably, reconciled to the ledger.',
    org: 'iOL World',
    period: 'Oct 2024 — present',
    role: 'Designed and built the queue pipeline (publisher, consumer, DLQ recovery) and the settle-vs-auth reconciliation; sole author of the DLQ consumer.',
    featured: true,
    tags: ['Go', 'Azure Service Bus', 'GCP Pub/Sub', 'PostgreSQL', 'Idempotency'],
    summary:
      'Two-stage pipeline that accepts provider pushes fast, queues them, and processes them with retries, dead-lettering and per-provider recovery — then reconciles what providers say happened against what the ledger believes.',
    flow: ['Provider push', 'Accept + dedup insert', 'Queue (Service Bus / Pub/Sub)', 'Peek-lock consumer', 'Provider processor', 'Ledger + audit row', 'DLQ → recovery'],
    context:
      'Seven issuers (Citi, CXP, Wex, Checkout.com, Revolut, TripLink, Mastercard ICCP) push events over HTTP with different shapes, retry semantics and ordering guarantees. Some also deliver settlement files over SFTP that must agree with the webhooks. Losing or double-applying an event means a wrong balance on a real card.',
    specs: [
      { label: 'Ingress', value: 'One signed endpoint per provider (HMAC / Bearer / signature-verified); raw payload persisted before ack' },
      { label: 'Dedup', value: 'Natural keys (provider event id, subject + notification id) with ON CONFLICT DO NOTHING; one audit table per provider' },
      { label: 'Transport', value: 'Azure Service Bus (peek-lock) and GCP Pub/Sub behind one transport-neutral decision path: parse → source-check → route → ack / retry' },
      { label: 'Failure handling', value: 'Abandon-with-backoff until max delivery count, then dead-letter; final-attempt alerting; rate-limit backoff' },
      { label: 'Recovery', value: 'DLQ consumer with per-provider recovery handlers (CXP, Wex, CKO, Revolut) and an async replay endpoint for stranded webhooks' },
      { label: 'Reconciliation', value: 'Settle-vs-auth amount deltas across providers, CXP/Wex/CKO/TripLink settlement-file reconcile, mismatches recorded for review' },
      { label: 'Scale-out', value: 'CXP and Wex consumers ship as standalone binaries from the same image so they scale independently of the API' },
      { label: 'Tests', value: 'Scenario tests per provider per event type — auth, clearing, refund, reversal and settlement shapes each covered' },
    ],
    built: [
      'The Service Bus publisher, peek-lock consumer and DLQ consumer, later made transport-neutral so the same decision pipeline runs on GCP Pub/Sub.',
      'Per-provider processors for Citi, ICCP and TripLink push notifications (new design), plus CKO settlement processing and card-number masking in logs.',
      'Settle-vs-auth reconciliation: detects amount deltas between authorization and clearing across every provider and posts the correcting ledger entry.',
      'CXP settlement-file reconcile, refund/auth-reversal netting, and the CKO settlement-file flow over SFTP.',
      'Revolut webhook replay: hourly cron re-drives events stranded at status 0, with an on-demand endpoint for failed ones.',
      'Event-master mapping with an in-memory cache that normalises provider-specific event names into one internal catalogue.',
    ],
    decisions: [
      {
        title: 'Persist, then ack, then process',
        body: 'The raw event is written and acknowledged before any business logic runs. Providers see fast 2xx responses, and every event can be replayed from our own table if the queue or a consumer misbehaves.',
      },
      {
        title: 'Retry is the queue\'s job; recovery is a feature',
        body: 'Consumers never loop on failure — they abandon and let delivery count climb. Dead-lettered events are expected, and a recovery consumer turns a poison-message incident into a five-minute replay.',
      },
      {
        title: 'One decision path, two transports',
        body: 'Parsing, routing and the ack/retry decision were pulled out of the Service Bus receiver so the Pub/Sub consumer shares them verbatim. The migration from Azure to GCP became a transport change, not a rewrite.',
      },
      {
        title: 'Reconcile amounts, not just events',
        body: 'A clearing that arrives for a different amount than the authorization is normal (FX, tips, partial captures). The pipeline computes the delta and posts it, instead of trusting either side.',
      },
    ],
    impact: [
      '99% of provider events land on the first attempt; the rest dead-letter and replay rather than being lost. Ingestion is decoupled from API latency.',
      'Seven providers on one pipeline; onboarding a new one is a processor plus a recovery handler.',
      'Every event has an audit row keyed by provider id, so support questions are one search away.',
    ],
  },
  {
    slug: 'wallet-ledger',
    title: 'Multi-currency wallet on a double-entry ledger',
    subtitle: 'Client and issuing-side wallets across 31 currencies: top-ups, transfers, card funding, refunds and statements — every movement a balanced posting.',
    org: 'iOL World',
    period: 'Oct 2024 — present',
    role: 'One of two principal contributors to the wallets domain; built the FX-rate resolver and wallet statements.',
    featured: true,
    tags: ['Go', 'PostgreSQL', 'Double-entry ledger', 'FX', 'sqlx'],
    summary:
      'The balance side of the platform: multi-currency client wallets plus provider-side issuing wallets, with a ledger that records previous and updated balance on every debit/credit.',
    flow: ['Top-up / transfer / fund', 'Validate + idempotency', 'DB transaction', 'Debit + credit postings', 'Balance row (locked)', 'Statement / report'],
    context:
      'Wallets fund virtual cards. A balance that disagrees with its history, or a refund that double-credits, is a financial incident. The system had to handle concurrent funding from the card flow, cross-currency movements, refunds, manual adjustments by operations, and produce statements finance can reconcile.',
    specs: [
      { label: 'Wallet families', value: 'Client wallets (org × currency) and issuing wallets (org × currency × provider) with an in-transit balance for transfers' },
      { label: 'Ledger', value: 'Separate ledgers for client and issuing wallets: change type (credit/debit), previous and updated balance, references — written inside the same transaction as the movement' },
      { label: 'Operations', value: 'Create, top-up (multiple methods incl. bank transfer with proforma invoice), transfer, credit-check, fund/modify/cancel/refund transaction, manual adjustment, orders' },
      { label: 'FX', value: 'Internal fxrate resolver: live Treasury rates with a 30-minute cache and a database fallback; markup rules per client' },
      { label: 'Concurrency', value: 'Row-level locks on the balance row; *Tx helper variants so multi-table writes compose in one transaction' },
      { label: 'Outputs', value: 'Wallet statements (PDF/XLSX), daily org balance email (issuing wallets folded in), funding-requirement views' },
    ],
    built: [
      'Wallet creation, top-up, wallet-to-wallet transfer, manual adjustment, and the transaction detail/list APIs.',
      'Refund-to-wallet and the refund/cancel lifecycle for funded transactions, including fund-reversed events after card cancellation.',
      'The fxrate package: a single provider every conversion resolves through, backed by Treasury with cached rates and a database fallback.',
      'Wallet statements and the daily wallet-balance report with issuing-wallet totals.',
      'Order status split into action + payment status, plus the bank-details endpoint for the top-up screen.',
    ],
    decisions: [
      {
        title: 'Balances are derived, never overwritten blindly',
        body: 'Every movement writes the ledger row with previous and updated balance under a row lock. Reconciliation is a query, not an investigation.',
      },
      {
        title: 'Reversal, not deletion',
        body: 'A refund is a new posting that mirrors the original. Nothing is mutated or removed, which keeps audit and statements trivially correct.',
      },
      {
        title: 'One FX entry point',
        body: 'Conversion used to be scattered. Funnelling every rate lookup through one provider with cache and fallback made rates consistent across cards, wallets and reports.',
      },
    ],
    impact: [
      'Balances provably reconcile to posting history across 31 currencies.',
      'The same ledger feeds statements, the reporting service and finance reports.',
      'Funding path survives provider and Treasury outages via fallbacks instead of failing top-ups.',
    ],
  },
  {
    slug: 'virtual-credit-cards',
    title: 'Virtual card platform & issuer integrations',
    subtitle: 'Issue, fund, modify, reissue and cancel virtual cards across seven issuing providers.',
    org: 'iOL World',
    period: 'Oct 2024 — present',
    role: 'Core contributor from the first commit. Built the Revolut integration end to end and most of Checkout.com; owned lifecycle APIs, card verification and client-facing webhooks. Connector/routing core was a team effort.',
    featured: true,
    tags: ['Go', 'Provider integrations', 'OAuth1 / OAuth2 / mTLS', 'Webhooks'],
    summary:
      'A B2B travel-payments card engine: per-booking single-use cards routed to the best issuer by currency, amount and client rules, with the full lifecycle audited and pushed to clients as webhooks.',
    flow: ['Client API', 'Validate + auth', 'Provider routing', 'Connector (7 issuers)', 'Card issued + funded', 'Lifecycle events', 'Client webhook'],
    context:
      'Travel businesses need a fresh card per booking, in the supplier\'s currency, capped at the booking amount. Each issuer has its own API, auth scheme (OAuth1, OAuth2, mTLS, signed webhooks), currency coverage and quirks. Cards must be modifiable, reissuable and cancellable, and clients must be told what happened.',
    specs: [
      { label: 'Providers', value: 'Citi VCA, CXP/Conferma, Wex/EnCompass, Checkout.com, Revolut, TripLink, Mastercard ICCP — one connector package each behind a shared interface + factory' },
      { label: 'Lifecycle', value: 'Issue → fund → modify (amount, dates) → reissue → cancel/terminate → refund; each transition persisted as an event with a rollup materialised view' },
      { label: 'Routing', value: 'Rule-based by currency, brand, country and beneficiary category; USD and cross-provider fallback; failover when an issuer is down' },
      { label: 'Resilience', value: 'Outbound gateway with timeouts, retries with backoff and circuit breakers; transient 5xx retry on Revolut card calls' },
      { label: 'Client webhooks', value: 'Subscription model per org; created / activated / funded / terminated events with a versioned payload' },
      { label: 'Quality gate', value: 'PR pipeline I set up and own: gofmt, vet, golangci-lint, tidy and tests with coverage — blocking on every merge' },
    ],
    built: [
      'Revolut Business issuing integration: client SDK, webhook signature verification, card activation windows, MCC allow-list auto-expansion on category declines, reconciliation and replay.',
      'Checkout.com: card masking, auth-reversal and settled-reversal events, termination-date modification, settlement-file processing over SFTP.',
      'VCC lifecycle APIs — cancel, modify, reissue, details/list with pagination — plus Expired and Funded-Failed statuses, display status, and card verification on the auth webhook.',
      'Outbound webhook subscriptions to clients, and the payload restructure (eventDetails + top-level UDFs) used by external integrators.',
      'Platform hygiene: the resilient HTTP client, make check / make fix quality gates, the PR validation pipeline, and alerting for every money-relevant cron via a single LogAlertableFailure path.',
    ],
    decisions: [
      {
        title: 'Every money-affecting call is idempotent',
        body: 'Client-supplied keys and unique constraints ensure a retried "issue card" or "fund" never produces two of anything — providers retry, clients retry, we retry.',
      },
      {
        title: 'Provider quirks stay in the connector',
        body: 'Revolut declines hotel merchants until their MCC is allow-listed; CXP cannot unsuspend a card; Citi needs mTLS + OAuth1. All of that lives in the provider package; the orchestration layer never branches on issuer.',
      },
      {
        title: 'Alert on the failure, not the symptom',
        body: 'Critical crons were failing quietly. Routing every money-relevant job through one alertable-failure path turned silent breakage into a Teams message with context.',
      },
    ],
    impact: [
      'Seven live issuing providers across 31 currencies on a platform serving ~1M requests/day.',
      'Revolut went from zero to production issuer, including its own reconciliation and replay tooling.',
      'PR quality gates and coverage reporting are now blocking on every merge.',
    ],
  },
  {
    slug: 'reporting-service',
    title: 'Financial reporting service',
    subtitle: 'Self-serve, scheduled and exported reports over wallet and card data — nine report types, three formats, timezone-aware delivery.',
    org: 'iOL World',
    period: 'Jun 2025 — present',
    role: 'Primary author of the service; built most of the service and repository layers, ES logging, exports and scheduled delivery.',
    tags: ['Go', 'PostgreSQL', 'sqlx', 'excelize', 'Azure Blob', 'cron'],
    summary:
      'A standalone Go service where users define reports (columns, filters, UDFs, output options), preview them, export to CSV/XLSX/PDF, and schedule email delivery — all read-only against the wallet database.',
    flow: ['Report definition', 'Access control (wallet type / admin)', 'Dynamic SQL builder', 'Read replica query', 'CSV / XLSX / PDF', 'Blob + CDN', 'Scheduled email'],
    context:
      'Finance and operations users needed recurring exports over months of card and wallet activity, scoped to what their organisation is allowed to see. Naïve exports timed out, deep OFFSET paging was O(n²) on the database, and schedules had to fire in each organisation\'s local time.',
    specs: [
      { label: 'Report types', value: 'VCC summary, cards, events; orders; iOLX and issuing wallet statements; combined statement; accounting (admin-only) — 9 in total' },
      { label: 'Access control', value: 'Per-org wallet type gates which report types are visible; admin-only provider columns are not projected in SQL and free-text fields are provider-masked at read time' },
      { label: 'Querying', value: 'Dynamic WHERE builder with typed operators (equals, in, between, contains…), rolling date ranges, UDF filters and template-scoped UDF columns' },
      { label: 'Exports', value: 'CSV, XLSX (excelize) and PDF; single bounded query (1M-row cap) with retry on hot-standby recovery conflicts; uploaded to Azure Blob behind a CDN' },
      { label: 'Scheduling', value: 'robfig/cron with daily / weekly / monthly schedules resolved in the report\'s IANA timezone; separate worker binary for the scheduler tier' },
      { label: 'Observability', value: 'Batched Elasticsearch logging with typed events and field sanitisation; identity-service auth middleware' },
    ],
    built: [
      'The service and repository layers for reports, deliveries, exports, output options and UDFs, including the dynamic filter-to-SQL translation.',
      'Wallet-type and admin access control, provider masking, and the "iOLX admin sees all child orgs" model.',
      'Export pipeline to CSV/XLSX/PDF with number/date formatting, empty-report generation, masked card numbers and Azure Blob upload.',
      'Timezone-aware scheduled delivery with email notifications, plus recipients on manual exports.',
      'Elasticsearch structured logging (v1 and v2) and the identity-service middleware.',
    ],
    decisions: [
      {
        title: 'One bounded query beats deep pagination',
        body: 'Progressively deeper OFFSET pages were quadratic on the read replica and triggered standby recovery-conflict cancellations. A single capped query with retry fixed both, and never truncates silently.',
      },
      {
        title: 'Access control in the SQL projection',
        body: 'Admin-only columns are excluded at query-build time rather than filtered after the fact, so a non-admin export cannot leak a provider name even by accident.',
      },
      {
        title: 'Separate server and worker binaries',
        body: 'Same codebase, two entrypoints: the API stays responsive while the scheduler tier scales for month-end load.',
      },
    ],
    impact: [
      'Nine report types self-served by clients instead of ad-hoc SQL requests to engineering.',
      'Large exports run in bounded memory with no replica conflicts.',
      'Reports land in each organisation\'s inbox on schedule, in their timezone.',
    ],
  },
  {
    slug: 'notification-service',
    title: 'Org-wide email notification service',
    subtitle: 'The shared email service every team calls: templated, localised, with encrypted PDF attachments and full history.',
    org: 'iOL World',
    period: '2025',
    role: 'Designed and built solo, from schema to production.',
    tags: ['Go', 'Gin', 'GORM', 'PostgreSQL', 'SendGrid / SMTP', 'Azure Blob', 'chromedp'],
    summary:
      'A Gin + GORM microservice that renders per-client, per-language templates from Blob Storage, sends via SendGrid or a caller-supplied SMTP relay with retries, optionally renders the email to an encrypted PDF, and keeps a searchable delivery history.',
    flow: ['Caller (JWT)', 'Validate + persist', 'Template fetch (client / lang)', 'Render', 'SendGrid or SMTP (retries)', 'PDF → encrypt → Blob', 'History + SAS URL'],
    context:
      'Several services were each sending email their own way, with inconsistent templates, no localisation and no retry or audit story. The goal was one versioned API that any team could adopt without deploying anything of their own.',
    specs: [
      { label: 'API', value: 'v1 (snake_case, legacy) and v2 (camelCase, searchKey, date filters) side by side; JWT-authenticated; health + ping endpoints' },
      { label: 'Templates', value: 'Fetched from Azure Blob by client / language / template name; language codes normalised with fallback to English; Go templates with dynamic helper functions' },
      { label: 'Delivery', value: 'SendGrid by default or per-request SMTP (implicit TLS on 465 or STARTTLS); bounded retries; async send with persisted status' },
      { label: 'PDF', value: 'HTML rendered with headless Chrome (chromedp), encrypted with a random 16-character password via pdfcpu, stored in Blob; password kept with the record' },
      { label: 'Access', value: 'Time-limited SAS download URLs, cached until expiry, refreshable on demand' },
      { label: 'History', value: 'Paginated email history by reference / searchKey / sender / date range; per-notification detail' },
      { label: 'Ops', value: 'New Relic APM middleware, GORM auto-migration, Docker image' },
    ],
    built: [
      'The whole service: data model, migrations, auth, controllers, template engine, delivery, PDF pipeline and history APIs.',
      'A v2 API introduced without breaking v1 callers, documented with a versioning guide for consuming teams.',
      'Language fallback so a missing locale never blocks an email.',
      'Encrypted PDF attachments with SAS-based retrieval for compliance-sensitive documents.',
    ],
    decisions: [
      {
        title: 'Templates as data, not code',
        body: 'Teams manage their own templates and locales in Blob Storage; the service never needs a deploy to change copy or add a language.',
      },
      {
        title: 'Two API versions, one code path',
        body: 'v2 requests are normalised to the internal model, so legacy snake_case callers kept working while new teams got a cleaner contract.',
      },
      {
        title: 'Render once, secure by default',
        body: 'PDFs are encrypted before they touch storage and only ever served through short-lived SAS URLs.',
      },
    ],
    impact: ['Adopted by every engineering team in the organisation.', 'One audit trail and one search for all outbound email.'],
  },
  {
    slug: 'pulse-realtime-chat',
    title: 'Pulse — realtime chat',
    subtitle: 'Go + WebSockets + React, deployed as a single binary with live presence and typing indicators.',
    org: 'Personal',
    period: '2026',
    role: 'Solo take-home turned side project.',
    tags: ['Go', 'WebSockets', 'React', 'TypeScript', 'SQLite'],
    summary:
      'Link-is-access chat rooms with persistence, presence, typing indicators and reconnect-with-replay — shipped as one static Go binary.',
    flow: ['Browser', 'WebSocket /ws', 'Room hub (Go)', 'SQLite (pure Go)', 'Broadcast', 'Other clients'],
    context:
      'The brief left most decisions open, so the decisions became the deliverable: what to persist, how identity works, how rooms are scoped, and how to keep deployment to a single artifact.',
    specs: [
      { label: 'Transport', value: 'Raw WebSockets (gorilla/websocket); per-room hub goroutine' },
      { label: 'Persistence', value: 'SQLite via a pure-Go driver — no CGO, static binary, distroless container' },
      { label: 'Frontend', value: 'React 18 + TypeScript + Tailwind, embedded with go:embed' },
      { label: 'Realtime features', value: 'Presence, typing indicators (client-throttled, server-expired), reconnect with missed-message replay' },
    ],
    built: [
      'Go backend with a per-room hub and SQLite persistence.',
      'React client embedded into the binary — one service, one URL, no CORS.',
      'Live presence and typing indicators; reconnect handling with replay.',
    ],
    decisions: [
      { title: 'Per-URL rooms, link is access', body: 'The Figma/Miro model: the slug is the conversation. No accounts, no create/join/list UI.' },
      { title: 'Single binary deploy', body: 'Serving the SPA and the WebSocket endpoint from one process removed an entire class of split-origin problems.' },
    ],
    impact: ['Live demo and a README that documents every trade-off.'],
    links: [
      { label: 'Source on GitHub', href: 'https://github.com/manasgoyal95/realtime-chat' },
      { label: 'Live demo (free tier, ~15s cold start)', href: 'https://pulse-chat-7puv.onrender.com' },
    ],
  },
];
