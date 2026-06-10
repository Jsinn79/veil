# Veil

Privacy tools for the budget-conscious. Temporary phone numbers, virtual credit cards, and email aliases — at a fraction of the price.

## Architecture

- **Backend**: Node.js/TypeScript REST API
- **Frontend**: React/Next.js web app with Tailwind CSS
- **Database**: PostgreSQL
- **Payments**: Stripe
- **Phone Numbers**: Twilio
- **Virtual Cards**: Stripe Issuing

## Getting Started

_Coming soon._

## Project Structure

```
veil/
├── backend/          # REST API
│   ├── src/
│   │   ├── routes/   # API route handlers
│   │   ├── models/   # Database models
│   │   ├── services/ # Business logic & 3rd party integrations
│   │   └── middleware/
│   ├── tests/
│   └── package.json
├── frontend/         # Web application
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable UI components
│   │   └── lib/      # API client, utilities
│   ├── public/
│   └── package.json
└── docs/             # Architecture docs & API spec
```