# C216 - Sistemas Distribuídos

Projeto da disciplina C216 L1 - Sistemas Distribuídos.

Este repositório será usado para acompanhar as atividades e os projetos da matéria durante o semestre.

**Aluno:** Lucca Madeira

## Tecnologias usadas

- Python
- Poetry
- FastAPI
- Uvicorn
- Pytest
- HTTPX
- Ruff
- Makefile
- Docker
- Docker Compose
- PostgreSQL

O backend conta com uma API mínima em FastAPI (endpoint `GET /` de status) e com um ambiente Docker Compose com dois serviços: o backend e um banco de dados PostgreSQL. Por enquanto, o backend ainda não se conecta ao banco — essa integração fica para uma próxima etapa da disciplina.

## Como executar

### Com Docker

Pré-requisito: Docker e Docker Compose instalados.

```
make docker-up
```

A aplicação fica disponível em http://localhost:8000.

Para parar os containers:

```
make docker-down
```

Outros comandos disponíveis: `make docker-build`, `make docker-logs`, `make docker-restart`, `make docker-clean` (remove também os dados do banco) e `make shell` (abre um terminal dentro do container do backend). Veja `make help` para a lista completa.

### Sem Docker

Pré-requisito: Python 3.11+ e Poetry instalados.

```
make install
make run
```

A aplicação fica disponível em http://localhost:8000.

## Desafios extras

Além do que a Prática 2 pedia, foram implementados desafios extras de Docker:

- **Healthcheck**: a API (`GET /`) e o banco (`pg_isready`) têm healthcheck configurado no compose; o backend só inicia depois do banco ficar saudável, e o worker só depois do backend.
- **Usuário não-root**: o container do backend roda com um usuário sem privilégios (`appuser`), em vez de root.
- **Dependências de dev e produção separadas**: já eram organizadas em grupos separados no Poetry (grupo `dev` com pytest/httpx/ruff); o container só instala as dependências de produção.
- **Worker**: um segundo serviço que chama a API a cada 10 segundos para demonstrar comunicação entre containers pelo nome do serviço. Reaproveita a mesma imagem do backend. Logs com `docker compose logs worker`.
- **Rede nomeada**: os serviços usam uma rede explícita (`c216-network`) em vez da rede padrão implícita do Compose.
