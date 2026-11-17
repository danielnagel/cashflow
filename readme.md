# cashflow

Personal web app that fetches bank transactions via FinTS, stores them in PostgreSQL and shows
income, expenses and fixed costs.

- **Backend:** Python 3.13, FastAPI, SQLAlchemy, Alembic, [python-fints](https://github.com/raphaelm/python-fints)
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, TanStack Query, react-i18next
- **Database:** PostgreSQL 16

## Development

Requirements: Docker with Compose. Everything else runs inside the containers.

```sh
cp .env.example .env    # fill in the passwords
docker compose up --build
docker compose down     # add -v to also delete the database
```

Changes in `backend/src` and `frontend/src` are picked up without a rebuild. Changes to
dependencies, Dockerfiles or migrations need `docker compose up --build`.

| Service | URL |
|---|---|
| Frontend (Vite dev server) | http://127.0.0.1:5173 |
| Backend | http://127.0.0.1:8000/api/health |
| Database | `127.0.0.1:5432` |

Without further configuration the backend uses generated test data (`TRANSACTION_SOURCE=fake`).

## Quality gates

The gates additionally need [uv](https://docs.astral.sh/uv/), Node.js 26 (see `.nvmrc`) and make.
They run in CI on every push, so running them locally is optional.

```sh
make install
make check
```

runs, in this order and stopping at the first failure:

| Target | Content |
|---|---|
| `make test` | `pytest` against a Postgres container (`docker-compose.test.yml`), `vitest` |
| `make lint` | `ruff`, `mypy`, `eslint`, `prettier`, `tsc` |
| `make build` | Vite build, images of both compose files |
| `make e2e` | Playwright against the production images (`docker-compose.e2e.yml`) |

CI runs the same targets on every push. Images are pushed to GHCR from `main` only.

## Database roles

`db/init/10-roles.sh` creates two roles on first start of the database:

- `cashflow_owner` owns the schema and is only used by the migration step (`alembic upgrade head`).
- `cashflow_app` is the runtime role of the backend with `SELECT`, `INSERT`, `UPDATE`, `DELETE` on
  the tables, but no right to create or drop anything.

## Images

| Image | Build | Port |
|---|---|---|
| Backend | `docker build backend` | 8000 |
| Frontend (nginx, proxies `/api` to `cashflow-backend:8000`) | `docker build -f frontend/Dockerfile .` | 8080 |

The backend runs as a single process on purpose, because the banking PIN is only kept in memory.
The migration runs as a separate one-off container from the backend image:
`alembic upgrade head` with the owner role.

### Backend environment

| Variable | Default | Meaning |
|---|---|---|
| `MODE` | `prod` | `prod`, `dev` or `e2e` (`e2e` enables test endpoints under `/api/_test/`) |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | `cashflow-db`, `5432`, `cashflow` | Database connection |
| `DB_USER`, `DB_PASSWORD` | `cashflow_app`, – | Database role |
| `TRANSACTION_SOURCE` | `fints` | `fints` or `fake` |
| `FAKE_SEED` | `1` | Seed of the generated test data |
| `FINTS_BLZ`, `FINTS_SERVER` | – | Bank code and FinTS server URL of the bank |
| `FINTS_LOGIN`, `FINTS_PRODUCT_ID` | – | FinTS login name and registered product ID |

## License

[ISC](LICENSE)
