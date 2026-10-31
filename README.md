# C216 - Sistemas Distribuídos

Projeto da disciplina C216 L1 - Sistemas Distribuídos.

Este repositório será usado para acompanhar as atividades e os projetos da matéria durante o semestre.

**Aluno:** Lucca  Marcondes Madeira

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
- SQLAlchemy
- psycopg
- Alembic
- JavaScript
- Node.js e npm
- React
- Vite
- Tailwind CSS
- Biome
- Vitest
- React Testing Library
- Playwright

O backend conta com uma API em FastAPI para cadastrar, consultar, atualizar e remover itens. O endpoint `GET /` continua retornando o status da API. O ambiente Docker Compose tem o backend, um banco PostgreSQL e um worker.

Na Prática 5, os itens são salvos no PostgreSQL e continuam disponíveis após reiniciar a API. O Alembic versiona a estrutura do banco.

## Como executar

### Com Docker

Pré-requisito: Docker e Docker Compose instalados.

```
make up-build
```

A aplicação fica disponível em http://localhost:8000.

Esse comando constrói a imagem e sobe os serviços. O backend espera o banco ficar saudável, aplica as migrations e inicia a API.

Para parar os containers:

```
make docker-down
```

Outros comandos disponíveis: `make docker-build`, `make docker-logs`, `make docker-restart`, `make docker-clean` (remove também os dados do banco) e `make shell` (abre um terminal dentro do container do backend). Veja `make help` para a lista completa.

### Sem Docker

Pré-requisitos: Python 3.11+, Poetry, Make e um PostgreSQL disponível. Para usar apenas o banco do Compose, execute `docker compose up -d db`.

A conexão é configurada por `DATABASE_URL`. O valor padrão para execução local é `postgresql+psycopg://postgres:postgres@localhost:5432/c216_db`. Para configurar no PowerShell:

```powershell
$env:DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/c216_db"
```

No Linux ou macOS, use `export DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/c216_db"`.

```
make install
make db-upgrade
make run
```

A aplicação fica disponível em http://localhost:8000.

## Prática 5 - Organização e persistência

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
│   ├── services/
│   │   └── item.py
│   ├── repositories/
│   │   └── item.py
│   ├── models/
│   │   └── item.py
│   ├── database/
│   │   ├── base.py
│   │   └── session.py
│   └── core/
│       └── config.py
├── alembic/
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
├── tests/
│   ├── conftest.py
│   ├── unit/
│   │   ├── test_root.py
│   │   ├── test_item_service.py
│   │   └── test_worker.py
│   └── integration/
│       ├── test_status.py
│       └── test_items.py
├── alembic.ini
├── pyproject.toml
└── poetry.lock
```

O `main.py` só cria a aplicação e registra os routers. As rotas recebem as requisições HTTP, os schemas Pydantic validam os dados e o service cuida das operações com os itens. O repository acessa o banco usando o modelo SQLAlchemy. A pasta `database` define a base dos modelos e a sessão, e `core/config.py` lê a configuração da conexão.

O fluxo é: rota → service → repository → SQLAlchemy → PostgreSQL. Os schemas representam a entrada e a saída da API; o modelo ORM representa a tabela `items`.

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
- As responsabilidades foram divididas nas camadas pedidas na apostila.
- O PostgreSQL gera os IDs. Cada requisição recebe uma sessão, fechada ao final, e o repository confirma as alterações com `commit`.
- A tabela é criada pela migration inicial do Alembic, sem depender de criar tabelas automaticamente pelo ORM.
- Dentro do Compose, `DATABASE_URL` usa o host `db`. Fora do container, o acesso usa `localhost`.
- `PUT` usa o modelo de criação para substituir os dados, e `PATCH` usa um modelo com campos opcionais para permitir atualização parcial.
- Os testes unitários do service usam um repository simulado. Os de integração usam `TestClient` e um PostgreSQL separado para verificar as rotas e a persistência.

### Migrations

Depois de alterar um modelo, gere a migration:

```text
make db-migration msg="descricao da alteracao"
```

Revise o arquivo criado em `backend/alembic/versions` antes de aplicar:

```text
make db-upgrade
make db-current
```

Para consultar o histórico, execute `poetry run alembic history` dentro de `backend`. O Alembic usa a mesma configuração de conexão da aplicação. A migration inicial permite criar a tabela a partir de um banco vazio.

### Como conferir a persistência

1. Execute `make up-build`.
2. Abra http://localhost:8000/docs e crie um item com `POST /items`.
3. Consulte o item com `GET /items/{item_id}`.
4. Execute `docker compose restart backend`.
5. Consulte o mesmo ID e confirme que os dados continuam disponíveis.

Também é possível conferir diretamente no banco:

```text
docker compose exec db psql -U postgres -d c216_db -c "SELECT * FROM items;"
```

## Como executar os testes

Com o PostgreSQL em execução, crie o banco de testes uma vez:

```text
make db-test-create
```

Se o banco `c216_test` já existir, não é necessário criá-lo novamente. Os testes usam `TEST_DATABASE_URL`, com o padrão `postgresql+psycopg://postgres:postgres@localhost:5432/c216_test`. Caso use outro banco de testes, o nome deve terminar com `_test`.

Execute a suíte:

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

As migrations são aplicadas no banco de testes antes dos testes de integração. Cada teste começa com a tabela de itens vazia e a sequência de IDs reiniciada. Esse banco deve ser usado apenas para testes. Os testes unitários não precisam de um PostgreSQL em execução.

Todos os endpoints possuem testes automatizados, incluindo casos de erro. Um teste também cria um item pela API e o consulta em outra sessão do banco, verificando que a gravação foi confirmada.

### CI

O arquivo `.github/workflows/ci-backend.yml` executa em `push` e `pull_request`. O job `Ruff` verifica formatação e lint. O job `Pytest` sobe um serviço PostgreSQL com o banco `c216_test` e executa todos os testes unitários e de integração. Os filtros `paths` limitam a execução a alterações em `backend/`, no próprio workflow ou no `.gitignore` da raiz.

### Checklist da prática

Antes da entrega, execute:

```text
make format
make lint
make test
make up-build
```

Confira se a API e o PostgreSQL iniciam, se as migrations executam, se o CRUD funciona e se os dados permanecem após reiniciar a API. Confira também os testes e o resultado do CI no GitHub após enviar as alterações.

### Cobertura de testes (extra)

Como tarefa extra, o projeto gera um relatório visual com a cobertura dos testes atuais:

```
make coverage
```

Depois, abra `backend/htmlcov/index.html` no navegador. A cobertura ajuda a encontrar partes sem testes, mas não substitui bons cenários de teste.

## Prática 6 - Frontend com React

O frontend permite cadastrar e listar itens com nome obrigatório de até 100 caracteres e descrição opcional. A interface usa Tailwind CSS, adapta as colunas para telas menores e mostra a quantidade de itens cadastrados.

Os dados ficam apenas no estado do React e são apagados ao atualizar a página. Não há chamadas à API nem persistência. O frontend funciona sem iniciar o backend ou o Docker.

### Estrutura do frontend

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ItemForm.jsx
│   │   └── ItemList.jsx
│   ├── App.jsx
│   ├── validation.js
│   ├── index.css
│   └── main.jsx
├── tests/
│   ├── setup.js
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── biome.json
├── index.html
├── package.json
├── package-lock.json
├── playwright.config.js
└── vite.config.js
```

O `App.jsx` mantém os itens em memória. O `ItemForm` valida e envia os dados ao componente pai, e o `ItemList` mostra os itens ou a mensagem de lista vazia. As regras de validação ficam em `validation.js`.

### Como executar

Pré-requisitos: Node.js 22 LTS atualizado e npm. Make é opcional.

A partir da raiz:

```text
cd frontend
npm ci
npm run dev
```

A interface fica disponível em http://localhost:5173.

Com Make, use `make frontend-install` e `make frontend-dev` a partir da raiz.

### Qualidade e testes

Instale o Chromium uma vez para executar os testes E2E, dentro de `frontend/`:

```text
npx playwright install chromium
```

Antes da entrega, execute na mesma pasta:

```text
npm run lint
npm run format:check
npm run test
npm run build
npm run test:e2e
```

Use `npm run format` para aplicar a formatação. O Biome verifica o código e a formatação, sem ESLint ou Prettier. O build gera a pasta `dist/`, ignorada pelo Git.

Os testes unitários usam Vitest e React Testing Library para verificar a validação e os componentes isolados. Os de integração verificam o cadastro pelo formulário e a exibição na lista. O Playwright testa a interface, o nome vazio e o cadastro no Chromium, iniciando o Vite automaticamente.

Na raiz, os comandos equivalentes são `make frontend-check`, `make frontend-test`, `make frontend-build` e `make frontend-test-e2e`. O `make check-all` verifica backend e frontend e também exige o ambiente de testes da Prática 5.

### CI

O arquivo `.github/workflows/ci-frontend.yml` executa em `pull_request` e em `push` na `main` quando há alterações em `frontend/` ou no próprio workflow. Ele usa Node.js 22, instala as dependências com `npm ci` e verifica lint, formatação, testes, build e E2E. O `package-lock.json` deve acompanhar o código no repositório.

Com os filtros `paths`, alterações apenas no frontend não executam a CI do backend, e vice-versa. Checks obrigatórios de workflows que não forem disparados podem ficar pendentes.

Na entrega, registre as evidências no pull request com as labels `Frontend`, `Test` e `Prática 6`.

## Desafios extras

Além do que a Prática 2 pedia, foram feitos os sete desafios extras:

1. **Healthcheck da API**: usa o endpoint `GET /` para conferir se o backend está respondendo.
2. **Healthcheck do PostgreSQL**: usa o `pg_isready` e o backend espera o banco ficar saudável antes de iniciar.
3. **Usuário não-root**: o container do backend roda com o usuário `appuser`, sem privilegios de root.
4. **Dependências separadas**: pytest, HTTPX e Ruff ficam no grupo de desenvolvimento do Poetry. A imagem instala apenas as dependências principais.
5. **Worker**: o serviço chama a API a cada 10 segundos usando o nome `backend` na rede do Compose. Os logs podem ser vistos com `docker compose logs worker`.
6. **Rede nomeada**: os serviços usam a rede `c216-network`, criada de forma explicita no Compose.
7. **Comandos no Makefile**: `make shell` abre um terminal no backend e `make clean` remove os arquivos de cache do projeto.
