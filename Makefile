# Quality gates. `make check` runs all of them in order and stops at the first failure;
# CI runs exactly the same targets.

.NOTPARALLEL:

# Node.js in the version from .nvmrc if nvm is installed; otherwise (CI) whatever is on PATH.
NVM_SH := $(wildcard $(or $(NVM_DIR),$(HOME)/.nvm)/nvm.sh)
ifneq ($(NVM_SH),)
NODE_BIN := $(shell bash -c '. "$(NVM_SH)" >/dev/null && nvm use --silent >/dev/null && dirname "$$(command -v node)"')
export PATH := $(if $(NODE_BIN),$(NODE_BIN):)$(PATH)
endif

TEST_COMPOSE := docker compose -f docker-compose.test.yml
E2E_COMPOSE := docker compose -f docker-compose.e2e.yml

.PHONY: check install test test-backend test-frontend test-db lint lint-backend lint-frontend \
	build e2e format down

check: test lint build e2e

install:
	cd backend && uv sync --frozen
	npm ci
	cd e2e && npx playwright install $(if $(CI),--with-deps) chromium

test: test-backend test-frontend

test-db:
	$(TEST_COMPOSE) up -d --wait

test-backend: test-db
	cd backend && uv run pytest

test-frontend:
	npm run test --workspace=frontend

lint: lint-backend lint-frontend

lint-backend:
	cd backend && uv run ruff check .
	cd backend && uv run ruff format --check .
	cd backend && uv run mypy

lint-frontend:
	npx eslint --max-warnings=0 .
	npx prettier --check .
	npm run typecheck --workspaces

# Production images via the e2e stack (the dev stack needs a .env); the dev target on top.
build:
	npm run build --workspace=frontend
	$(E2E_COMPOSE) build
	docker build --target dev -f frontend/Dockerfile -t cashflow-frontend:dev .

e2e:
	$(E2E_COMPOSE) up -d --wait
	npm run test --workspace=e2e || { $(E2E_COMPOSE) logs; $(E2E_COMPOSE) down -v; exit 1; }
	$(E2E_COMPOSE) down -v

format:
	cd backend && uv run ruff format . && uv run ruff check --fix .
	npx prettier --write .

down:
	$(TEST_COMPOSE) down -v
	$(E2E_COMPOSE) down -v
