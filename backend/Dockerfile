FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1

RUN pip install --no-cache-dir poetry==2.1.4

# copia so os arquivos de dependencia primeiro pra aproveitar cache do docker
COPY pyproject.toml poetry.lock ./
RUN poetry install --only main --no-ansi

# cria um usuario sem privilegios pra rodar a aplicacao, em vez de root
RUN useradd --create-home appuser
COPY --chown=appuser:appuser . .
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
