POETRY := poetry
BACKEND_DIR := backend
PYTEST := cd $(BACKEND_DIR) && $(POETRY) run pytest
UVICORN := cd $(BACKEND_DIR) && $(POETRY) run uvicorn
RUFF := cd $(BACKEND_DIR) && $(POETRY) run ruff

.DEFAULT_GOAL := help

.PHONY: help install test lint format run clean

help:
	@echo "Comandos disponiveis:"
	@echo "  make install  - instala as dependencias"
	@echo "  make test     - executa os testes"
	@echo "  make lint     - verifica o codigo"
	@echo "  make format   - formata o codigo"
	@echo "  make run      - inicia a aplicacao"
	@echo "  make clean    - remove arquivos temporarios"

install:
	cd $(BACKEND_DIR) && $(POETRY) install

test:
	$(PYTEST)

lint:
	$(RUFF) check .

format:
	$(RUFF) format .

# A API de exemplo foi removida porque preferi nao colocar coisa alem do que foi pedido
# Por isso make run ainda nao funciona
run:
	$(UVICORN) app.main:app --reload

clean:
	@powershell -NoProfile -Command "Remove-Item -Recurse -Force -ErrorAction SilentlyContinue backend\__pycache__, backend\.pytest_cache, backend\.ruff_cache"
