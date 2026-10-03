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
- Pytest-cov
- HTTPX
- Ruff
- Makefile
- Docker
- Docker Compose
- PostgreSQL

O backend conta com uma API em FastAPI para cadastrar, consultar, atualizar e remover itens. O endpoint `GET /` continua retornando o status da API. O ambiente Docker Compose tem o backend, um banco PostgreSQL e um worker.

Na Prática 4, os itens ficam em memória e são perdidos ao reiniciar a API. O backend ainda não se conecta ao banco, pois a persistência fica para uma próxima prática.

## Como executar

### Com Docker

Pré-requisito: Docker e Docker Compose instalados.

```
make docker-up
```

A aplicação fica disponível em http://localhost:8000.

Se a imagem já foi construída antes das alterações, execute `make docker-build` antes de subir os containers.

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

## Prática 4 - Organização e API

### Estrutura do backend

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   └── routes/
│   │       ├── status.py
│   │       └── items.py
│   ├── schemas/
│   │   └── item.py
│   └── services/
│       └── item.py
├── tests/
│   ├── conftest.py
│   ├── unit/
│   │   ├── test_root.py
│   │   ├── test_item_service.py
│   │   └── test_worker.py
│   └── integration/
│       ├── test_status.py
│       └── test_items.py
├── pyproject.toml
└── poetry.lock
```

O `main.py` só cria a aplicação e registra os routers. As rotas recebem as requisições HTTP, os schemas Pydantic validam os dados e o service cuida das operações com os itens.

### Endpoints

| Método | Caminho | Função | Sucesso |
|---|---|---|---|
| GET | `/` | Consultar o status da API | 200 |
| GET | `/items` | Listar os itens | 200 |
| GET | `/items/{item_id}` | Buscar um item pelo ID | 200 |
| POST | `/items` | Criar um item | 201 |
| PUT | `/items/{item_id}` | Substituir os dados do item | 200 |
| PATCH | `/items/{item_id}` | Atualizar os campos enviados | 200 |
| DELETE | `/items/{item_id}` | Remover um item | 204, sem corpo |

O `item_id` é um Path Parameter do tipo inteiro. Um ID que não existe retorna `404`, e um ID ou corpo inválido retorna `422`.

Exemplo de corpo para `POST` e `PUT`:

```json
{
  "name": "Caderno",
  "description": "Material da aula"
}
```

O `name` é obrigatório e não pode ser vazio ou nulo. A `description` é opcional. No `PUT`, omitir a descrição remove a descrição anterior. No `PATCH`, os campos omitidos são mantidos; enviar `{"description": null}` remove a descrição e enviar `{}` mantém os dados atuais.

### Como testar pela documentação automática

Com a API em execução, abra http://localhost:8000/docs. Use **Try it out** para criar um item com `POST /items`, consulte o ID retornado e teste `GET`, `PUT`, `PATCH` e `DELETE`. A rota `GET /` também está disponível nessa página.

### Decisões da implementação

- O recurso `items` segue o exemplo da apostila, com apenas nome e descrição.
- As responsabilidades foram divididas entre rotas, schemas e services, seguindo a estrutura da aula.
- Foi usado um dicionário em memória com IDs sequenciais. Ainda não foram adicionadas camadas de banco ou repository.
- `PUT` usa o modelo de criação para substituir os dados, e `PATCH` usa um modelo com campos opcionais para permitir atualização parcial.
- Os testes da Prática 3 foram mantidos e reorganizados. Os unitários verificam funções diretamente, e os de integração usam `TestClient` para verificar as rotas, a validação e o service juntos.

## Como executar os testes

```
make test
```

Para executar cada grupo separadamente:

```text
make test-unit
make test-integration
```

Também é possível executar sem Makefile, a partir da pasta `backend`:

```text
poetry run python -m pytest tests
poetry run python -m pytest tests/unit
poetry run python -m pytest tests/integration
```

Cada teste começa com o armazenamento de itens vazio, sem depender dos dados deixados por outro teste. Todos os endpoints possuem testes automatizados, incluindo casos de erro.

### CI

O arquivo `.github/workflows/ci-backend.yml` executa em `push` e `pull_request`. O job `Ruff` verifica formatação e lint, e o job `Pytest` executa todos os testes unitários e de integração. Não há filtro por arquivos, para que os checks obrigatórios também sejam executados quando o PR alterar apenas documentação.

### Cobertura de testes (extra)

Como tarefa extra, o projeto gera um relatório visual com a cobertura dos testes atuais:

```
make coverage
```

Depois, abra `backend/htmlcov/index.html` no navegador. A cobertura ajuda a encontrar partes sem testes, mas não substitui bons cenários de teste.

## Desafios extras

Além do que a Prática 2 pedia, foram feitos os sete desafios extras:

1. **Healthcheck da API**: usa o endpoint `GET /` para conferir se o backend está respondendo.
2. **Healthcheck do PostgreSQL**: usa o `pg_isready` e o backend espera o banco ficar saudável antes de iniciar.
3. **Usuário não-root**: o container do backend roda com o usuário `appuser`, sem privilegios de root.
4. **Dependências separadas**: pytest, HTTPX e Ruff ficam no grupo de desenvolvimento do Poetry. A imagem instala apenas as dependências principais.
5. **Worker**: o serviço chama a API a cada 10 segundos usando o nome `backend` na rede do Compose. Os logs podem ser vistos com `docker compose logs worker`.
6. **Rede nomeada**: os serviços usam a rede `c216-network`, criada de forma explicita no Compose.
7. **Comandos no Makefile**: `make shell` abre um terminal no backend e `make clean` remove os arquivos de cache do projeto.
