# Etapa 06 - API REST da Aplicação

## Objetivo

Esta etapa adiciona uma API REST ao AgendaFácil. O recurso principal escolhido foi **clientes**, pois ele já faz parte do domínio da aplicação e possui operações de cadastro, consulta, edição e exclusão.

O servidor foi construído com Node.js e Express. Ele responde em JSON, valida os dados recebidos e utiliza códigos HTTP coerentes para sucesso e erro.

## Estrutura adicionada

```text
api/
├── server.js
├── package.json
└── postman/
    └── AgendaFacil-Clientes.postman_collection.json
```

- `server.js`: define o servidor, as rotas, validações, respostas e erros.
- `package.json`: declara a dependência Express e os comandos de execução.
- `postman/AgendaFacil-Clientes.postman_collection.json`: coleção pronta para importar e testar a API.

Os dados são mantidos em memória nesta etapa. Isso simplifica os testes dos endpoints: ao parar e iniciar o servidor, os dois clientes de exemplo são recriados. A persistência em banco de dados continuará sendo uma evolução posterior do projeto.

## Como executar

É necessário ter o Node.js instalado. Na raiz do repositório, abra um terminal e execute:

```text
cd api
npm install
npm start
```

O servidor ficará disponível em:

```text
http://localhost:3000
```

Para desenvolvimento, também é possível usar:

```text
npm run dev
```

O comando `npm install` cria a pasta `node_modules`, que está ignorada pelo Git. O arquivo `package-lock.json` criado por esse comando deve ser incluído no commit, pois registra a versão exata das dependências utilizadas.

## Formato das respostas

Respostas bem-sucedidas retornam:

```json
{
  "sucesso": true,
  "dados": {}
}
```

Respostas de erro retornam:

```json
{
  "sucesso": false,
  "erro": {
    "codigo": "DADOS_INVALIDOS",
    "mensagem": "Explique o erro aqui."
  }
}
```

O endpoint `DELETE` bem-sucedido usa `204 No Content`, portanto não devolve corpo de resposta.

## Endpoints

| Método | Rota | Descrição | Sucesso | Erros principais |
| --- | --- | --- | --- | --- |
| GET | `/api/clientes` | Lista todos os clientes. | 200 | - |
| GET | `/api/clientes/:id` | Busca um cliente pelo id. | 200 | 400, 404 |
| POST | `/api/clientes` | Cria um cliente. | 201 | 400, 422 |
| PUT | `/api/clientes/:id` | Substitui nome, telefone e e-mail de um cliente. | 200 | 400, 404, 422 |
| PATCH | `/api/clientes/:id` | Altera somente os campos enviados. | 200 | 400, 404, 422 |
| DELETE | `/api/clientes/:id` | Exclui um cliente. | 204 | 400, 404 |

### GET - Listar clientes

```text
GET http://localhost:3000/api/clientes
```

Resposta 200:

```json
{
  "sucesso": true,
  "dados": [
    {
      "id": 1,
      "nome": "Ana Exemplo",
      "telefone": "(11) 99999-1111",
      "email": "ana@example.com"
    }
  ]
}
```

### GET - Consultar um cliente

```text
GET http://localhost:3000/api/clientes/1
```

Se o id não existir, a API responde 404:

```json
{
  "sucesso": false,
  "erro": {
    "codigo": "CLIENTE_NAO_ENCONTRADO",
    "mensagem": "Cliente não encontrado."
  }
}
```

### POST - Criar cliente

```text
POST http://localhost:3000/api/clientes
Content-Type: application/json
```

Body:

```json
{
  "nome": "Carla Postman",
  "telefone": "(11) 97777-3333",
  "email": "carla.postman@example.com"
}
```

Resposta 201:

```json
{
  "sucesso": true,
  "dados": {
    "id": 3,
    "nome": "Carla Postman",
    "telefone": "(11) 97777-3333",
    "email": "carla.postman@example.com"
  }
}
```

### PUT - Atualizar o cliente inteiro

```text
PUT http://localhost:3000/api/clientes/3
Content-Type: application/json
```

```json
{
  "nome": "Carla Postman Atualizada",
  "telefone": "(11) 97777-4444",
  "email": "carla.atualizada@example.com"
}
```

### PATCH - Atualizar parcialmente

```text
PATCH http://localhost:3000/api/clientes/3
Content-Type: application/json
```

```json
{
  "email": "carla.patch@example.com"
}
```

### DELETE - Excluir cliente

```text
DELETE http://localhost:3000/api/clientes/3
```

Resposta: `204 No Content`.

## Regras de validação

- O id precisa ser número inteiro positivo.
- Nome é obrigatório em POST e PUT e deve ter de 2 a 80 caracteres.
- Telefone é obrigatório em POST e PUT e deve possuir DDD e 10 ou 11 dígitos.
- E-mail é opcional; quando informado, precisa ser válido e ter no máximo 120 caracteres.
- Os únicos campos aceitos são `nome`, `telefone` e `email`.
- Não é permitido repetir telefone, mesmo mudando parênteses, espaços ou hífen.
- PATCH precisa enviar pelo menos um campo válido.

## Testes com Postman

1. Inicie a API com `npm start`.
2. Abra o Postman.
3. Clique em **Import** e selecione `api/postman/AgendaFacil-Clientes.postman_collection.json`.
4. Abra a coleção importada e execute a pasta **CRUD de clientes** na ordem apresentada:
   1. GET - Listar clientes
   2. GET - Consultar cliente por id
   3. POST - Criar cliente
   4. PUT - Atualizar cliente completo
   5. PATCH - Atualizar somente e-mail
   6. DELETE - Excluir cliente
5. Depois, execute os três itens da pasta **Cenários de erro**.

A requisição POST grava automaticamente o id criado na variável `clienteCriadoId`. Assim, PUT, PATCH e DELETE usam esse mesmo cliente, sem ser necessário digitar seu id manualmente.

## Evidências sugeridas

O PDF da Etapa 06 não exige explicitamente capturas de tela. Porém, as evidências tornam a demonstração da API mais clara. Salve as imagens dentro de `docs/evidencias/etapa-06/`:

1. `01-get-lista.png`: no Postman, resultado 200 do GET `/api/clientes`, mostrando URL, método, status e JSON.
2. `02-get-individual.png`: resultado 200 do GET `/api/clientes/1`.
3. `03-post-criacao.png`: resultado 201 após POST com o novo cliente.
4. `04-put-atualizacao.png`: resultado 200 após PUT.
5. `05-patch-atualizacao-parcial.png`: resultado 200 após PATCH.
6. `06-delete-exclusao.png`: resultado 204 após DELETE.
7. `07-erro-validacao.png`: resultado 422 do POST inválido.
8. `08-erro-nao-encontrado.png`: resultado 404 do GET com id 999.

Em cada captura, deixe visíveis o método HTTP, URL, código de status e resposta. Para o DELETE, o status 204 é a evidência principal, já que a resposta é vazia por definição.

## Versão da entrega

Tag Git: `etapa-06`.
