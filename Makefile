POETRY := poetry
BACKEND_DIR := backend
PYTEST := cd $(BACKEND_DIR) && $(POETRY) run python -m pytest tests
COVERAGE := cd $(BACKEND_DIR) && $(POETRY) run python -m pytest --cov=app --cov=worker --cov-report=term-missing --cov-report=html tests
UVICORN := cd $(BACKEND_DIR) && $(POETRY) run uvicorn
RUFF := cd $(BACKEND_DIR) && $(POETRY) run ruff
COMPOSE := docker compose

.DEFAULT_GOAL := help

.PHONY: help install test test-unit test-integration coverage lint format run clean shell docker-build docker-up docker-down docker-logs docker-restart docker-clean up-build logs-api db-upgrade db-migration db-current db-test-create
.PHONY: frontend-install frontend-dev frontend-lint frontend-format frontend-check frontend-test frontend-test-e2e frontend-build check-all

help:
	@echo "Comandos disponiveis:"
	@echo "  make install        - instala as dependencias"
	@echo "  make test           - executa os testes"
	@echo "  make test-unit      - executa os testes unitarios"
	@echo "  make test-integration - executa os testes de integracao"
	@echo "  make coverage       - gera o relatorio de cobertura"
	@echo "  make lint           - verifica o codigo"
	@echo "  make format         - formata o codigo"
	@echo "  make run            - inicia a aplicacao"
	@echo "  make clean          - remove arquivos temporarios"
	@echo "  make shell          - abre um terminal dentro do container do backend"
	@echo "  make docker-build   - constroi as imagens do backend e do banco"
	@echo "  make docker-up      - sobe os containers em segundo plano"
	@echo "  make docker-down    - para e remove os containers"
	@echo "  make docker-logs    - acompanha os logs dos containers"
	@echo "  make docker-restart - reinicia os containers"
	@echo "  make docker-clean   - para os containers e apaga o volume do banco (perde os dados)"
	@echo "  make up-build       - constroi e sobe os containers"
	@echo "  make logs-api       - acompanha os logs da API"
	@echo "  make db-upgrade     - aplica as migrations no banco local"
	@echo "  make db-migration msg=nome - gera uma migration para revisao"
	@echo "  make db-current     - mostra a migration atual"
	@echo "  make db-test-create - cria o banco separado de testes (uma vez)"
	@echo "  make frontend-install - instala as dependencias do frontend"
	@echo "  make frontend-dev   - inicia o frontend com Vite"
	@echo "  make frontend-lint  - verifica o codigo do frontend"
	@echo "  make frontend-format - formata o codigo do frontend"
	@echo "  make frontend-check - verifica lint e formatacao do frontend"
	@echo "  make frontend-test  - executa os testes unitarios e de integracao"
	@echo "  make frontend-test-e2e - executa os testes com Playwright"
	@echo "  make frontend-build - gera o build do frontend"
	@echo "  make check-all      - verifica backend e frontend"

install:
	cd $(BACKEND_DIR) && $(POETRY) install

test:
	$(PYTEST)

test-unit:
	$(PYTEST)/unit

test-integration:
	$(PYTEST)/integration

coverage:
	$(COVERAGE)

lint:
	$(RUFF) check .

format:
	$(RUFF) format .

run:
	$(UVICORN) app.main:app --reload

clean:
	@powershell -NoProfile -Command "Get-ChildItem -Path backend -Recurse -Directory -Force | Where-Object { $$_.Name -in '__pycache__', '.pytest_cache', '.ruff_cache' } | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"

shell:
	$(COMPOSE) exec backend bash

docker-build:
	$(COMPOSE) build

docker-up:
	$(COMPOSE) up -d

docker-down:
	$(COMPOSE) down

docker-logs:
	$(COMPOSE) logs -f

docker-restart:
	$(COMPOSE) restart

up-build:
	$(COMPOSE) up -d --build

logs-api:
	$(COMPOSE) logs -f backend

db-upgrade:
	cd $(BACKEND_DIR) && $(POETRY) run alembic upgrade head

db-migration:
	cd $(BACKEND_DIR) && $(POETRY) run alembic revision --autogenerate -m "$(msg)"

db-current:
	cd $(BACKEND_DIR) && $(POETRY) run alembic current

db-test-create:
	$(COMPOSE) exec db createdb -U postgres c216_test

# cuidado: apaga tambem o volume do banco (perde os dados)
docker-clean:
	$(COMPOSE) down -v

frontend-install:
	npm --prefix frontend ci

frontend-dev:
	npm --prefix frontend run dev

frontend-lint:
	npm --prefix frontend run lint

frontend-format:
	npm --prefix frontend run format

frontend-check:
	npm --prefix frontend run check

frontend-test:
	npm --prefix frontend run test

frontend-test-e2e:
	npm --prefix frontend run test:e2e

frontend-build:
	npm --prefix frontend run build

check-all:
	$(RUFF) format --check .
	$(MAKE) lint test frontend-check frontend-test frontend-build frontend-test-e2e
