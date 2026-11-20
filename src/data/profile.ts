// Sitedeki tüm içerik burada. Metni değiştirmek için sadece bu dosyayı düzenle.

export interface Link {
  label: string;
  href: string;
  handle: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface StackLayer {
  title: string;
  body: string;
  items: string[];
}

export interface Pattern {
  title: string;
  category: string;
  body: string;
}

export interface Capability {
  title: string;
  items: string[];
}

export interface Role {
  hash: string;
  tag: string;
  title: string;
  company: string;
  period: string;
  location: string;
  highlights: { title: string; body: string }[];
  head?: boolean;
}

export interface Project {
  name: string;
  domain: string;
  context: string;
  summary: string;
  notes: string[];
  diagram: string;
  stack: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  place: string;
}

export const profile = {
  name: "Furkan Comoglu",
  initials: "FC",
  user: "furkan",
  host: "istanbul",
  role: "Senior Software Engineer",
  location: "Istanbul, Türkiye",
  availability: "Open to remote · Senior Software Engineer & Tech Lead roles",
  tagline: ["PHP / Symfony", "Java / Spring Boot", "Node.js", "PostgreSQL", "RabbitMQ", "React / Vue.js"],
  lede:
    "I design and scale the backend of high-traffic platforms: APIs, data stores, queues and caches, from architecture to production.",
  summary:
    "Backend-focused, with 10+ years across marketplaces, e-commerce, CRM and B2B travel. Specialized in API and system design (PHP/Symfony, Java/Spring Boot, Node.js), PostgreSQL at scale, event-driven architecture and multi-layer caching. Solid, hands-on frontend experience with React, Vue.js and TypeScript, owning features end to end, from database to UI. Experienced in technical mentorship and AI-assisted development.",
  email: "furkan.comoglu@hotmail.com",
  resume: "/furkan-comoglu-resume.pdf",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/furkan-comoglu", handle: "in/furkan-comoglu" },
    // TODO: GitHub kullanıcı adını doğrula
    { label: "GitHub", href: "https://github.com/fcomoglu", handle: "fcomoglu" },
  ] satisfies Link[],
  stats: [
    { value: "10+", label: "years shipping production software" },
    { value: "4", label: "industries: marketplace, e-commerce, CRM, travel" },
    { value: "6", label: "roles from intern to senior engineer" },
  ] satisfies Stat[],
};

/* 01 Stack */
export const stackIntro = {
  title: "The Stack",
  lede:
    "A request on a high-traffic marketplace touches every layer I work on: the edge, the cache, the API, the queue and the data stores behind it. I own that path end to end.",
  diagram: String.raw`
  client ──► Cloudflare CDN ──► Varnish / HTTP cache
                                      │
                                      ▼
               ┌──────────── API (Symfony · Spring Boot · Node.js) ────────────┐
               │   REST · Webhooks · SOAP · rate limiting · API gateway        │
               └───────┬───────────────┬────────────────┬──────────────┬───────┘
                       │               │                │              │
                    Redis       Elasticsearch      RabbitMQ ──► workers │
                   (cache)        (search)        (events · outbox)     │
                                                                        ▼
                       PostgreSQL · MySQL · MongoDB · Google BigQuery
                       (sharding · partitioning · replication · reporting)

  ci: GitHub Actions / Drone CI ──► Docker images ──► AWS`,
};

export const stack: StackLayer[] = [
  {
    title: "Backend",
    body: "Domain logic, public and internal APIs, third-party and legacy integrations.",
    items: ["PHP (Symfony, Laravel)", "Java (Spring Boot)", "Node.js", "RESTful APIs", "SOAP", "Webhooks"],
  },
  {
    title: "Frontend",
    body: "Customer-facing UIs, CRM screens and internal admin panels.",
    items: ["React", "Vue.js", "TypeScript", "JavaScript", "jQuery"],
  },
  {
    title: "Data & Search",
    body: "Relational, document and warehouse workloads, plus full-text search.",
    items: [
      "PostgreSQL (sharding, partitioning, replication)",
      "MySQL",
      "MongoDB",
      "Google BigQuery",
      "Elasticsearch",
      "Redis",
    ],
  },
  {
    title: "Cloud, DevOps & Caching",
    body: "Containerised delivery, automated pipelines and multi-layer caching.",
    items: ["AWS", "Docker", "GitHub Actions", "Drone CI", "RabbitMQ", "Varnish", "HTTP caching", "Cloudflare CDN"],
  },
];

/* 02 Patterns */
export const patterns: Pattern[] = [
  {
    title: "Clean / Onion Architecture",
    category: "Application",
    body: "Domain at the centre, dependencies pointing inward. Applied while refactoring legacy CRM and marketplace code into maintainable, testable layers.",
  },
  {
    title: "Microservices",
    category: "Infrastructure",
    body: "Independently deployable services with clear contracts, like the c-commerce core and the LilaChat messaging service talking over defined inter-service patterns.",
  },
  {
    title: "Event-Driven Architecture",
    category: "Infrastructure",
    body: "RabbitMQ-backed asynchronous messaging and background processing for a multi-tenant SaaS CRM, decoupling writes from slow side effects.",
  },
  {
    title: "Outbox & Idempotency",
    category: "Domain",
    body: "Events written in the same transaction as state and consumers that are safe to retry, so nothing is lost or processed twice.",
  },
  {
    title: "Rate Limiting & API Gateways",
    category: "Web / API",
    body: "Protecting public APIs, webhooks and partner integrations at the edge before traffic ever reaches the application.",
  },
  {
    title: "SOLID & Design Patterns",
    category: "Application",
    body: "Repository, strategy, adapter and facade where they earn their place. OOP that keeps large codebases changeable.",
  },
  {
    title: "Test-backed Delivery",
    category: "Quality",
    body: "Unit and integration tests (PHPUnit, JUnit, Jest), static analysis and CI quality gates. The safety net behind major framework upgrades.",
  },
];

/* 03 Capabilities */
export const capabilities: Capability[] = [
  {
    title: "High-traffic performance",
    items: [
      "Multi-layer caching: Redis, HTTP caching, Varnish, Cloudflare CDN",
      "Elasticsearch search optimisation",
      "Catalog search & API response time tuning",
    ],
  },
  {
    title: "Database scaling",
    items: [
      "PostgreSQL sharding, replication, table partitioning",
      "Routine maintenance: VACUUM, indexing",
      "Complex, high-performance reporting queries",
    ],
  },
  {
    title: "Async & distributed systems",
    items: [
      "RabbitMQ event-driven messaging",
      "Background processing & workers",
      "Multi-tenant SaaS architecture",
    ],
  },
  {
    title: "Data & analytics",
    items: [
      "Reporting pipelines",
      "Polyglot persistence: MySQL, MongoDB, BigQuery",
      "Custom CRM reporting modules",
    ],
  },
  {
    title: "Modernisation & security",
    items: [
      "Major Symfony version upgrades",
      "Legacy refactoring to Clean Architecture",
      "Zero-day vulnerability patching",
    ],
  },
  {
    title: "Leadership & workflow",
    items: [
      "Mentoring interns, mid-level and senior engineers",
      "Code reviews, pair programming, architecture guidance",
      "AI-assisted development workflows",
    ],
  },
];

/* 04 Experience (git log) */
export const experience: Role[] = [
  {
    hash: "d0c7a2e",
    tag: "v6",
    head: true,
    title: "Senior Software Engineer",
    company: "Dugun.com",
    period: "Jul 2025 - Jul 2026",
    location: "Istanbul · Remote",
    highlights: [
      {
        title: "Marketplace core & end-to-end delivery",
        body: "Architected and maintained critical features across core APIs, website backend & UI, CRM and admin panels with Symfony, TypeScript, React and Vue.js.",
      },
      {
        title: "Framework upgrades & code quality",
        body: "Led major Symfony upgrades across API and website backend services, with PHPUnit/Jest tests, static analysis and systematic refactoring.",
      },
      {
        title: "Multi-layer caching",
        body: "Cut response times with Redis, HTTP caching, Varnish and Cloudflare CDN, alongside Elasticsearch optimisations.",
      },
      {
        title: "Data, cloud & CI/CD",
        body: "Reporting pipelines across MySQL, MongoDB and BigQuery; production workloads on AWS shipped through Docker and Drone CI.",
      },
    ],
  },
  {
    hash: "a41f9bc",
    tag: "v5",
    title: "Senior Software Engineer",
    company: "next4biz",
    period: "Jul 2022 - Jul 2025",
    location: "Istanbul · Hybrid",
    highlights: [
      {
        title: "Multi-tenant SaaS CRM",
        body: "Scalable REST APIs, webhooks and third-party integrations in Symfony, with RabbitMQ for event-driven messaging and background jobs.",
      },
      {
        title: "Database architecture & reporting",
        body: "Large PostgreSQL and MongoDB estates (sharding, replication, partitioning, maintenance) and complex reporting queries.",
      },
      {
        title: "Modernisation & mentorship",
        body: "Clean Architecture refactors, CI quality gates and Docker workflows; mentored interns through senior hires via reviews and pairing.",
      },
      {
        title: "Security",
        body: "Proactively patched zero-day vulnerabilities and shipped frontend features in React, JavaScript and jQuery.",
      },
    ],
  },
  {
    hash: "7e3b10d",
    tag: "v4",
    title: "Senior Software Engineer",
    company: "Sefamerve",
    period: "Oct 2020 - Jun 2022",
    location: "Istanbul · Remote",
    highlights: [
      {
        title: "E-commerce core (c-commerce)",
        body: "Drove architecture and system design of the core backend microservice in Laravel and MySQL, the backbone for every frontend and internal service.",
      },
      {
        title: "Real-time messaging (LilaChat)",
        body: "Co-designed the Node.js chat microservice and its communication patterns with the core API for low-latency customer conversations.",
      },
      {
        title: "Search & delivery",
        body: "Redis and Elasticsearch strategies for high e-commerce traffic; React UIs and standardised Docker deployments.",
      },
    ],
  },
  {
    hash: "3c58e61",
    tag: "v3",
    title: "Software Engineer",
    company: "TRS GROUP",
    period: "May 2017 - Oct 2020",
    location: "Istanbul",
    highlights: [
      {
        title: "B2B travel booking platform",
        body: "End-to-end reservation workflows, search and partner integrations for travel agencies with Laravel and Vue.js.",
      },
      {
        title: "Internal CRM",
        body: "Spring Boot + jQuery CRM automating partner management, customer tracking and reporting.",
      },
      {
        title: "Data & cloud",
        body: "MySQL and MongoDB models for travel inventory, Redis caching for hot queries, Docker on AWS.",
      },
    ],
  },
  {
    hash: "91d0f4a",
    tag: "v2",
    title: "Software Engineer",
    company: "Freelance",
    period: "Jan 2013 - May 2017",
    location: "Remote",
    highlights: [
      {
        title: "Custom web & e-commerce",
        body: "E-commerce platforms, CRMs and corporate apps from scratch with PHP, Spring Boot, React and Vue.js.",
      },
      {
        title: "Integrations",
        body: "REST and SOAP integrations with payment gateways, ERP systems and third-party platforms; PostgreSQL/MySQL, Redis, AWS.",
      },
    ],
  },
  {
    hash: "0a1e2c3",
    tag: "v1",
    title: "Software Engineering Intern",
    company: "Setur",
    period: "Jan 2010 - Jan 2011",
    location: "Istanbul",
    highlights: [
      {
        title: "First commit",
        body: "Developed, tested and maintained corporate web applications and customer-facing websites during a one-year internship.",
      },
    ],
  },
];

/* 05 Projects */
export const projects: Project[] = [
  {
    name: "Wedding Marketplace Platform",
    domain: "marketplace",
    context: "Dugun.com",
    summary:
      "Core APIs, website backend & UI, CRM and admin panels for a high-traffic vendor marketplace.",
    notes: [
      "Caching in layers: CDN → Varnish → HTTP cache → Redis",
      "Elasticsearch-backed vendor search",
      "Symfony major-version upgrades with test coverage as the gate",
      "Reporting across MySQL, MongoDB and BigQuery",
    ],
    diagram: String.raw`
 visitor ─► Cloudflare ─► Varnish ─► Website BE ─┐
                                                 ├─► Core API ─► MySQL
 vendor  ─► CRM / Admin (React · Vue) ───────────┘       │      MongoDB
                                                         ├─► Redis
                                                         └─► Elasticsearch
 reporting: MySQL / MongoDB ──► BigQuery`,
    stack: ["Symfony", "TypeScript", "React", "Vue.js", "Redis", "Varnish", "Elasticsearch", "AWS", "Drone CI"],
  },
  {
    name: "Multi-Tenant SaaS CRM",
    domain: "saas · crm",
    context: "next4biz",
    summary:
      "REST APIs, webhooks and integrations for a multi-tenant CRM, with asynchronous processing and heavy custom reporting.",
    notes: [
      "RabbitMQ for event-driven messaging and background jobs",
      "PostgreSQL sharding, replication and partitioning",
      "Redis distributed cache + Elasticsearch full-text search",
      "Clean Architecture refactor of legacy modules",
    ],
    diagram: String.raw`
 tenant apps ─► REST API / webhooks (Symfony)
                    │            │
                    │            └─► RabbitMQ ─► workers ─► integrations
                    ▼
       PostgreSQL (shards · replicas · partitions)   MongoDB
                    │
                    └─► reporting module (complex SQL)`,
    stack: ["Symfony", "PostgreSQL", "MongoDB", "RabbitMQ", "Redis", "Elasticsearch", "Docker"],
  },
  {
    name: "C-Commerce Core",
    domain: "e-commerce",
    context: "Sefamerve",
    summary:
      "The central e-commerce backend microservice: data and business logic for every customer-facing frontend and internal service.",
    notes: [
      "Architecture & system design ownership",
      "Caching and search strategy for peak traffic",
      "Standardised Docker containerisation",
    ],
    diagram: String.raw`
 storefront (React) ─┐
 internal services ──┼─► c-commerce API (Laravel) ─► MySQL
 lilachat ───────────┘          │
                                ├─► Redis
                                └─► Elasticsearch (catalog)`,
    stack: ["PHP", "Laravel", "MySQL", "Redis", "Elasticsearch", "React", "Docker"],
  },
  {
    name: "LilaChat",
    domain: "real-time",
    context: "Sefamerve",
    summary:
      "Real-time customer chat microservice built in Node.js, integrated with the core e-commerce API.",
    notes: [
      "Co-designed service boundaries and inter-service contracts",
      "Low-latency customer interactions",
      "Shared deployment model via Docker",
    ],
    diagram: String.raw`
 customer ◄──► lilachat (Node.js) ◄──► c-commerce API
                    │
                    └─► agents / support UI (React)`,
    stack: ["Node.js", "JavaScript", "React", "Docker"],
  },
  {
    name: "B2B Travel Booking Platform",
    domain: "travel",
    context: "TRS GROUP",
    summary:
      "Web-based booking platform for travel-agency partners: search, reservation workflows and partner integrations.",
    notes: [
      "End-to-end reservation flow",
      "Redis caching for high-frequency search & booking queries",
      "MySQL + MongoDB models for travel inventory",
    ],
    diagram: String.raw`
 agency ─► booking UI (Vue.js) ─► Laravel API ─► search ─► Redis
                                       │
                                       ├─► partner integrations
                                       └─► MySQL / MongoDB (inventory)`,
    stack: ["Laravel", "Vue.js", "MySQL", "MongoDB", "Redis", "AWS"],
  },
  {
    name: "Internal CRM & Automation",
    domain: "crm",
    context: "TRS GROUP",
    summary:
      "Company CRM automating partner management, customer tracking and internal reporting.",
    notes: [
      "Spring Boot backend, jQuery frontend",
      "Automated reporting workflows",
      "Dockerised on AWS",
    ],
    diagram: String.raw`
 staff ─► CRM UI (jQuery) ─► Spring Boot ─► MySQL / MongoDB
                                 │
                                 └─► scheduled reports`,
    stack: ["Java", "Spring Boot", "jQuery", "MySQL", "Docker", "AWS"],
  },
];

export const otherWork = [
  "Freelance e-commerce platforms, CRMs and corporate web apps (2013 - 2017)",
  "Payment gateway, ERP and SOAP integrations for client projects",
];

/* 06 Background */
export const education: Education[] = [
  {
    school: "Anadolu University",
    degree: "B.S. Management Information Systems",
    period: "2020 - present",
    place: "Türkiye",
  },
  {
    school: "Sakarya University",
    degree: "Associate Degree, Computer Programming",
    period: "Graduated 2020",
    place: "Sakarya, Türkiye",
  },
];

export const languages = [
  { name: "Turkish", level: "native" },
  { name: "English", level: "intermediate (B1)" },
];

export const nav = [
  { id: "stack", label: "Stack" },
  { id: "patterns", label: "Patterns" },
  { id: "capabilities", label: "Capabilities" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];
