matomo_compose := "docker compose -f docker-compose.matomo.yml"

default:
    @just --list

# Start local Matomo at http://localhost:8080
matomo-start:
    {{ matomo_compose }} up -d
    @echo "Matomo: http://localhost:8080"

# Stop local Matomo (data is kept in Docker volumes)
matomo-stop:
    {{ matomo_compose }} down

# Start the app-ux-flows dev server
ux-flows:
    pnpm --filter app-ux-flows dev

# Run lint, type check, tests and knip
check:
    pnpm lint
    pnpm check-types
    pnpm --filter app-ux-flows test
    pnpm --filter app-ux-flows knip
