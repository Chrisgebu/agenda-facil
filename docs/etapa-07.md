# Etapa 07 - Persistência e CRUD com Banco de Dados

## Objetivo

A Etapa 07 substitui os arrays temporários da API por persistência real em PostgreSQL. A API agora mantém os dados mesmo após ser encerrada e iniciada novamente.

O projeto usa duas entidades relacionadas:

- **Cliente:** pessoa que contrata o serviço.
- **Agendamento:** atendimento marcado para um cliente.

O modelo completo está em [modelo-banco-etapa-07.md](modelo-banco-etapa-07.md).

## Escolha tecnológica

Foi escolhido o **PostgreSQL**, banco relacional adequado para o AgendaFácil. A aplicação possui dados estruturados e um relacionamento claro entre clientes e agendamentos. O banco usa chave primária para identificar registros e chave estrangeira para garantir que um agendamento só exista para um cliente cadastrado.

O acesso é feito com o driver `pg`, usando consultas parametrizadas (`$1`, `$2` etc.). Isso evita concatenar valores recebidos na string SQL e reduz o risco de SQL Injection.

## Arquitetura MVC adotada

```text
Cliente HTTP
    ↓
Routes → Controllers → Services → Repositories → PostgreSQL
    ↓
Resposta JSON padronizada
```

| Camada | Pasta | Responsabilidade |
| --- | --- | --- |
| Routes | `api/src/routes/` | Mapeia URL e método HTTP para cada controller. |
| Controllers | `api/src/controllers/` | Recebe a requisição e devolve a resposta HTTP. |
| Services | `api/src/services/` | Aplica validações e regras de negócio. |
| Repositories | `api/src/repositories/` | Executa as consultas SQL. |
| Config | `api/src/config/` | Configura o pool de conexões PostgreSQL. |
| Utils | `api/src/utils/` | Padroniza respostas e tratamento de erros. |

Essa separação evita que as rotas acessem o banco diretamente. Se a tecnologia de persistência mudar futuramente, o impacto principal fica limitado aos repositórios.

## Preparar o PostgreSQL

### 1. Instalação

Instale o PostgreSQL e o pgAdmin pelo instalador oficial. Durante a instalação, defina e guarde a senha do usuário `postgres`. Mantenha a porta padrão `5432`.

### 2. Criar o banco pelo pgAdmin

1. Abra o **pgAdmin 4**.
2. Expanda **Servers** e conecte no servidor PostgreSQL usando a senha definida durante a instalação.
3. Clique com o botão direito em **Databases**.
4. Escolha **Create → Database...**.
5. Em **Database**, escreva exatamente:

```text
agenda_facil
```

6. Clique em **Save**.
7. Clique no banco `agenda_facil` criado.
8. Abra **Tools → Query Tool**.
9. Abra o arquivo `api/database/schema.sql`, copie todo o conteúdo para o Query Tool e clique em executar.
10. Depois abra `api/database/seed.sql`, copie o conteúdo e execute uma única vez.

O primeiro arquivo cria as tabelas e os índices. O segundo cadastra Ana, Bruno e dois agendamentos fictícios para teste.

### 3. Configurar a conexão da API

Dentro da pasta `api`, copie o arquivo `.env.example` e renomeie a cópia para `.env`.

No PowerShell, dentro de `api`, o comando é:

```powershell
Copy-Item .env.example .env
```

Abra o arquivo `.env` e substitua `SUA_SENHA` pela senha que você definiu no PostgreSQL:

```text
PORT=3000
DATABASE_URL=postgres://postgres:SUA_SENHA@localhost:5432/agenda_facil
```

O arquivo `.env` não deve ser enviado ao GitHub. Ele já está ignorado pelo `.gitignore`.

## Executar a API

Abra o PowerShell na raiz do repositório e execute:

```powershell
cd "C:\Users\chris\OneDrive\Documentos\GitHub\agenda-facil\api"
npm.cmd install
npm.cmd start
```

O uso de `npm.cmd` evita o bloqueio de scripts do PowerShell observado na configuração do computador.

Se a conexão estiver correta, aparecerá:

```text
API AgendaFácil disponível em http://localhost:3000
Banco de dados PostgreSQL conectado.
```

## Endpoints

### Clientes

| Método | Endpoint | Descrição | Status de sucesso |
| --- | --- | --- | --- |
| GET | `/api/clientes` | Lista clientes. | 200 |
| GET | `/api/clientes/:id` | Consulta um cliente. | 200 |
| POST | `/api/clientes` | Cria cliente. | 201 |
| PUT | `/api/clientes/:id` | Atualiza todos os campos. | 200 |
| PATCH | `/api/clientes/:id` | Atualiza campos informados. | 200 |
| DELETE | `/api/clientes/:id` | Exclui cliente sem agendamentos. | 204 |

Exemplo de criação:

```json
{
  "nome": "Carla Banco",
  "telefone": "(11) 97777-3333",
  "email": "carla.banco@example.com"
}
```

### Agendamentos

| Método | Endpoint | Descrição | Status de sucesso |
| --- | --- | --- | --- |
| GET | `/api/agendamentos` | Lista agendamentos com nome do cliente. | 200 |
| GET | `/api/agendamentos/:id` | Consulta um agendamento. | 200 |
| POST | `/api/agendamentos` | Cria agendamento para cliente existente. | 201 |
| PUT | `/api/agendamentos/:id` | Atualiza todos os campos. | 200 |
| PATCH | `/api/agendamentos/:id` | Atualiza campos informados. | 200 |
| DELETE | `/api/agendamentos/:id` | Exclui um agendamento. | 204 |

Exemplo de criação:

```json
{
  "clienteId": 1,
  "servico": "Corte",
  "duracao": 30,
  "data": "2026-12-15",
  "horario": "14:00",
  "observacoes": "Primeiro atendimento",
  "status": "Confirmado"
}
```

## Regras e erros tratados

| Situação | Resposta |
| --- | --- |
| Id inválido | 400 `ID_INVALIDO` |
| Registro não encontrado | 404 com código da entidade |
| Campos inválidos | 422 `DADOS_INVALIDOS` |
| Telefone duplicado | 409 `TELEFONE_DUPLICADO` |
| Cliente inexistente no agendamento | 422 `CLIENTE_NAO_ENCONTRADO` |
| Conflito de horário | 409 `HORARIO_OCUPADO` |
| Cliente com agendamentos ao excluir | 409 `CLIENTE_COM_AGENDAMENTOS` |
| Falha não prevista de banco | 500 `ERRO_PERSISTENCIA` |

Todas as respostas de sucesso seguem este formato:

```json
{
  "sucesso": true,
  "dados": {}
}
```

Todas as respostas de erro seguem este formato:

```json
{
  "sucesso": false,
  "erro": {
    "codigo": "CODIGO_DO_ERRO",
    "mensagem": "Descrição para quem usa a API."
  }
}
```

## Coleção Postman

Importe [../api/postman/AgendaFacil-Etapa07.postman_collection.json](../api/postman/AgendaFacil-Etapa07.postman_collection.json) no Postman.

Execute nesta ordem:

1. Pasta **1 - Clientes (CRUD persistente)**.
2. Pasta **2 - Agendamentos e relacionamento**.
3. Pasta **3 - Erros de validação**.

A coleção guarda o id do cliente criado em `clienteCriadoId` e o do agendamento em `agendamentoCriadoId`. Se o Postman não preencher a variável automaticamente, copie o `id` retornado pelo POST e troque manualmente na URL e no body das requisições seguintes.

## Teste de persistência

1. Pelo Postman, crie um cliente com POST e anote o id retornado.
2. Pare a API no PowerShell com `Ctrl + C`.
3. Inicie novamente com `npm.cmd start`.
4. Execute `GET /api/clientes/:id` com o mesmo id.
5. O status 200 e o mesmo cliente comprovam que os dados não estavam apenas na memória.

## Evidências sugeridas

O enunciado pede modelo, entidades, relacionamentos, instruções e operações CRUD; não exige explicitamente imagens. Ainda assim, capturas tornam a comprovação muito mais clara. Salve em `docs/evidencias/etapa-07/`:

1. `01-banco-modelo.png`: pgAdmin mostrando o banco `agenda_facil` e as tabelas `clientes` e `agendamentos`.
2. `02-post-cliente.png`: POST de cliente retornando 201.
3. `03-post-agendamento.png`: POST de agendamento retornando 201.
4. `04-get-agendamentos-relacionados.png`: GET da lista exibindo `cliente_nome` junto do agendamento.
5. `05-put-ou-patch.png`: atualização retornando 200.
6. `06-delete-agendamento.png`: DELETE do agendamento retornando 204.
7. `07-delete-cliente.png`: DELETE do cliente, após remover o agendamento, retornando 204.
8. `08-erro-integridade.png`: tentativa de excluir cliente com agendamento retornando 409.

Cada captura do Postman deve mostrar o método, URL, status e JSON quando houver resposta.

## Versão da entrega

Tag Git: `etapa-07`.
