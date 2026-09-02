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

O backend conta com uma API mínima em FastAPI (endpoint `GET /` de status) e com um ambiente Docker Compose com o backend, um banco de dados PostgreSQL e um worker. Por enquanto, o backend ainda não se conecta ao banco — essa integração fica para uma próxima etapa da disciplina.

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

Além do que a Prática 2 pedia, foram feitos os sete desafios extras:

1. **Healthcheck da API**: usa o endpoint `GET /` para conferir se o backend está respondendo.
2. **Healthcheck do PostgreSQL**: usa o `pg_isready` e o backend espera o banco ficar saudável antes de iniciar.
3. **Usuário não-root**: o container do backend roda com o usuário `appuser`, sem privilegios de root.
4. **Dependências separadas**: pytest, HTTPX e Ruff ficam no grupo de desenvolvimento do Poetry. A imagem instala apenas as dependências principais.
5. **Worker**: o serviço chama a API a cada 10 segundos usando o nome `backend` na rede do Compose. Os logs podem ser vistos com `docker compose logs worker`.
6. **Rede nomeada**: os serviços usam a rede `c216-network`, criada de forma explicita no Compose.
7. **Comandos no Makefile**: `make shell` abre um terminal no backend e `make clean` remove os arquivos de cache do projeto.
