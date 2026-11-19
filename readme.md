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

Without further configuration the backend uses generated test data (`TRANSACTION_SOURCE=fake`),
whose bank accepts the PIN from `FAKE_PIN` (default `12345`).

### App user

The app has exactly one user, who logs in with password and a code from an authenticator app
(TOTP). Create it once the stack is running:

```sh
docker compose exec -it cashflow-backend python -m cashflow.users create <username>
```

The command asks for the password, shows a QR code for the authenticator app and stores the user
after a code from the app has been confirmed. Sessions live in the memory of the backend for three
days; a restart logs out.

## Quality gates

The gates additionally need [uv](https://docs.astral.sh/uv/), Node.js 26 (see `.nvmrc`) and make.
With [nvm](https://github.com/nvm-sh/nvm) installed, make uses the version from `.nvmrc` on its own.
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
| `TOTP_ENCRYPTION_KEY` | – | Key that encrypts the TOTP secret in the database, at least 32 characters (`openssl rand -base64 32`) |
| `TRANSACTION_SOURCE` | `fints` | `fints` or `fake` |
| `FAKE_SEED`, `FAKE_PIN` | `1`, `12345` | Seed of the generated test data and the PIN its bank accepts |
| `FINTS_BLZ`, `FINTS_SERVER` | – | Bank code and FinTS server URL of the bank |
| `FINTS_LOGIN`, `FINTS_PRODUCT_ID` | – | FinTS login name and registered product ID |

## License

[ISC](LICENSE)
