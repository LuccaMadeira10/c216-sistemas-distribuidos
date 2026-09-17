POETRY := poetry
BACKEND_DIR := backend
PYTEST := cd $(BACKEND_DIR) && $(POETRY) run python -m pytest tests
COVERAGE := cd $(BACKEND_DIR) && $(POETRY) run python -m pytest --cov=app --cov=worker --cov-report=term-missing --cov-report=html tests
UVICORN := cd $(BACKEND_DIR) && $(POETRY) run uvicorn
RUFF := cd $(BACKEND_DIR) && $(POETRY) run ruff
COMPOSE := docker compose

.DEFAULT_GOAL := help

.PHONY: help install test coverage lint format run clean shell docker-build docker-up docker-down docker-logs docker-restart docker-clean

help:
	@echo "Comandos disponiveis:"
	@echo "  make install        - instala as dependencias"
	@echo "  make test           - executa os testes"
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

install:
	cd $(BACKEND_DIR) && $(POETRY) install

test:
	$(PYTEST)

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

# cuidado: apaga tambem o volume do banco (perde os dados)
docker-clean:
	$(COMPOSE) down -v
