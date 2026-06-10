# Veil

Privacy tools for the budget-conscious. Temporary phone numbers, virtual credit cards, and email aliases — at a fraction of the price.

## Features

- **Email Aliases** — Block spam before it reaches you. Create disposable email addresses that forward to your real inbox.
- **Virtual Cards** — Protect your real bank info with spend limits. Generate virtual cards via Stripe Issuing.
- **Burner Numbers** — Receive SMS for verifications safely. Rent temporary phone numbers via Twilio.

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Backend        | Node.js / TypeScript / Express    |
| Frontend       | React / Vite / Tailwind CSS       |
| Database       | PostgreSQL 16 (Neon serverless)   |
| Auth           | JWT (access + refresh tokens)     |
| Payments       | Stripe (Checkout + Billing Portal)|
| Virtual Cards  | Stripe Issuing                    |
| Phone Numbers  | Twilio                            |
| Validation     | Zod                               |
| API Spec       | OpenAPI 3.1                       |

## Architecture

```
veil/
├── backend/           # REST API
│   ├── src/
│   │   ├── config/    # Env config, DB connection, Stripe client
│   │   ├── db/        # Schema, migrations
│   │   ├── routes/    # Route handlers (auth, aliases, numbers, cards, subs)
│   │   ├── services/  # Business logic & provider integrations
│   │   ├── middleware/ # Auth, rate-limit, plan enforcement, error handler
│   │   ├── types/     # TypeScript interfaces & enums
│   │   └── utils/     # Errors, validation (Zod schemas)
│   └── tests/
├── frontend/          # Web application
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/ # Reusable UI components
│   │   └── lib/       # API client (Axios), utilities
│   └── public/
├── docs/              # OpenAPI spec, architecture docs
└── scripts/           # Deployment & dev scripts
```

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or Neon serverless account)
- Stripe account (for payments + Issuing)
- Twilio account (for phone numbers)

### Development

```bash
# Clone the repo
git clone https://github.com/Jsinn79/veil.git
cd veil

# Backend
cd backend
cp .env.example .env   # Edit with your credentials
npm install
npm run dev            # http://localhost:3001

# Frontend (in another terminal)
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Or use the all-in-one dev script:
```bash
./scripts/dev.sh
```

### Docker (Production-like)

```bash
# Edit .env with production credentials
docker compose up --build
```

### Database

```bash
cd backend
npm run db:migrate     # Push schema to database
npm run db:studio      # Open Drizzle Studio (GUI)
```

## API Documentation

Full API spec available at `docs/openapi.yaml`.  
View with any OpenAPI viewer (e.g., Swagger UI, Stoplight).

## Deployment

```bash
# Production
./scripts/deploy.sh production

# Staging
./scripts/deploy.sh staging
```

## Plan Tiers

| Feature              | Free         | Basic ($3/mo) | Pro ($7/mo)   |
|----------------------|-------------|---------------|---------------|
| Email aliases/mo     | 5           | 50            | Unlimited     |
| Phone numbers/mo     | 0           | 1             | 3             |
| Virtual cards        | 0           | 3             | 10            |
| SMS messages/mo      | 0           | 50            | 500           |
| Priority support     | —           | —             | ✓             |

## License

MIT