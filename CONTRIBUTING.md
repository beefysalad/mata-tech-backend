# Contributing

Thanks for contributing! This project is a small Fastify + TypeScript API built for a 1‑week challenge.

## Workflow
- Create a new branch from `main`.
- Keep changes focused and small.
- Open a PR with a clear summary and testing notes.

## Branch Naming
- `feature/<short-description>`
- `fix/<short-description>`
- `chore/<short-description>`

## Commit Style
- Use short, descriptive messages.
- Prefer conventional-style prefixes:
  - `feat:` new feature
  - `fix:` bug fix
  - `chore:` tooling or refactor
  - `docs:` documentation

## Local Development
```bash
npm install
npm run dev
```

## Docker
```bash
docker compose up --build
```

## Testing
- No automated tests yet. For now, verify endpoints manually or via Swagger UI at `/docs`.
