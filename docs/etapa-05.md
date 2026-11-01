# Etapa 05 - Modularização e Comunicação Assíncrona

## Objetivo

Preparar o front-end do AgendaFácil para consultar uma fonte externa e enviar alterações por operações assíncronas, mantendo o código dividido por responsabilidade.

## Como executar

Os módulos ES e a Fetch API precisam de um servidor HTTP local. Abra a pasta do repositório no Visual Studio Code e use a extensão Live Server, ou execute no terminal da raiz do projeto:

```text
python -m http.server 5500 --bind 127.0.0.1
```

Depois, abra `http://127.0.0.1:5500/src/clientes.html`.

Os dados criados, alterados e excluídos continuam armazenados no navegador pelo serviço simulado. A primeira consulta também busca `src/data/clientes-iniciais.json` com Fetch API. Mantenha a mesma URL, porta e navegador durante os testes, porque o `localStorage` é associado a essa origem.

## Organização em módulos

| Arquivo | Responsabilidade |
| --- | --- |
| `src/js/modulos/armazenamento.js` | Ler e gravar arrays no `localStorage`, validando JSON. |
| `src/js/modulos/interface.js` | Criar elementos e mostrar mensagens de sucesso, erro e carregamento. |
| `src/js/modulos/formatadores.js` | Formatar data e horário e converter horários para minutos. |
| `src/js/servicos/cliente-service.js` | Consultar o arquivo JSON com `fetch` e simular POST, PUT e DELETE de clientes. |
| `src/js/clientes.js` | Controlar a página Clientes, eventos, formulário, busca e estados da interface. |
| `src/js/agendamento.js` | Criar agendamentos usando funções importadas dos módulos. |
| `src/js/agenda.js` | Filtrar, listar e cancelar agendamentos usando funções importadas dos módulos. |

Cada página carrega seu script com `type="module"`. Dessa forma, `import` deixa explícito quais funções cada arquivo utiliza, evitando a concentração de toda a lógica em um único script global.

## Comunicação assíncrona

### Consulta

Ao abrir a página Clientes, `clientes.js` chama `consultarClientes()`. O serviço aguarda uma resposta simulada e usa `fetch` para carregar `src/data/clientes-iniciais.json`. A resposta é validada com `response.ok` e convertida com `response.json()`.

Na primeira execução, os dados recebidos criam a lista local inicial. Nas consultas seguintes, o arquivo JSON continua sendo consultado para demonstrar a comunicação externa e a lista persistida no navegador é devolvida para a tela.

### Operação submetida ao serviço simulado

Salvar um novo cliente chama `criarCliente()`, editar chama `atualizarCliente()` e excluir chama `excluirCliente()`. Essas três funções são assíncronas, usam `await` e aguardam uma `Promise` com atraso controlado antes de persistir a alteração. Elas representam, respectivamente, operações equivalentes a POST, PUT e DELETE de uma API.

Ao editar um cliente, os agendamentos ligados a ele recebem o novo nome. Ao excluir, o serviço bloqueia a operação se existir qualquer agendamento ligado ao cliente. Isso evita registros de agenda sem cliente correspondente.

### Estados tratados pela interface

| Estado | Como aparece na aplicação | Código responsável |
| --- | --- | --- |
| Carregamento | Faixa azul com “Consultando clientes no serviço...” e botões desativados. | `mostrarCarregamento` e `definirInterfaceOcupada`. |
| Sucesso da consulta | Mensagem verde com a quantidade de clientes carregados. | `carregarClientes`. |
| Sucesso do envio | Mensagem verde após cadastrar, editar ou excluir. | `salvarCliente` e `removerCliente`. |
| Erro de validação ou serviço | Mensagem vermelha, mantendo os dados sem alteração. | blocos `catch` e `obterDadosDoFormulario`. |
| Erro de comunicação | Botão “Simular erro de comunicação” consulta uma URL inexistente e trata o `response.ok` inválido. | `buscarDadosIniciais` e `carregarClientes(true)`. |

## Gestão de clientes

A lista de clientes agora mostra os botões **Editar** e **Excluir** em cada card.

- **Editar:** preenche o formulário, muda o título para “Editar cliente” e envia a alteração de forma assíncrona.
- **Cancelar edição:** limpa o formulário e retorna ao modo de cadastro, sem alterar dados.
- **Excluir:** pede confirmação e remove o cliente se ele não possuir agendamentos no histórico.
- **Telefone duplicado:** o serviço impede que duas pessoas tenham o mesmo telefone, mesmo com formatações diferentes.

## Matriz de evidências

| Requisito da Etapa 05 | Implementação | Evidência sugerida |
| --- | --- | --- |
| Separar o código em módulos | Módulos em `src/js/modulos/` e serviço em `src/js/servicos/`. | Código e estrutura do repositório. |
| Implementar chamadas assíncronas | `async`, `await`, `Promise` e `fetch` em `cliente-service.js`. | Capturas 01 e 02. |
| Consultar dados externos | `fetch` de `src/data/clientes-iniciais.json`. | `01-carregamento-consulta.png` e `02-consulta-sucesso.png`. |
| Submeter dados ao serviço simulado | `criarCliente`, `atualizarCliente` e `excluirCliente`. | `03-cadastro-sucesso.png`, `04-edicao-sucesso.png` ou `05-exclusao-sucesso.png`. |
| Tratar sucesso | Mensagens verdes após consulta e operações concluídas. | Capturas 02 a 05. |
| Tratar erro | Erros de validação, duplicidade, integridade e comunicação. | `06-erro-comunicacao.png`. |
| Tratar carregamento | Faixa azul e botões desativados durante cada `await`. | `01-carregamento-consulta.png`. |

## Roteiro para capturar as evidências

Use dados fictícios. Se já houver dados de testes anteriores, mantenha-os; a tela pode ser testada com qualquer quantidade de clientes. As imagens devem ser colocadas em `docs/evidencias/etapa-05/` com estes nomes:

1. Abra Clientes e clique em **Consultar dados do serviço**. Enquanto aparecer a faixa azul “Consultando clientes no serviço...”, faça a captura e salve como `01-carregamento-consulta.png`.
2. Espere a consulta terminar. A lista e a mensagem verde devem aparecer. Salve como `02-consulta-sucesso.png`.
3. No formulário, cadastre `Daniela Etapa Cinco`, telefone `(11) 97777-3333` e e-mail `daniela@example.com`. Durante a faixa “Enviando cliente ao serviço...” você pode fazer uma captura extra; depois da mensagem verde “Cliente cadastrado com sucesso.” capture e salve como `03-cadastro-sucesso.png`.
4. No card de Daniela, clique em **Editar**. Troque o telefone para `(11) 97777-4444` e clique em **Salvar alterações**. Depois da mensagem de sucesso, capture como `04-edicao-sucesso.png`.
5. Ainda no card de Daniela, clique em **Excluir** e confirme. Quando a mensagem verde indicar exclusão e o card desaparecer, capture como `05-exclusao-sucesso.png`.
6. Clique em **Simular erro de comunicação**. Após a faixa de carregamento, a mensagem vermelha deve informar que não foi possível consultar o serviço. A lista anterior deve continuar visível. Capture como `06-erro-comunicacao.png`.

No Chrome ou Edge, uma captura de tela comum com `Win + Shift + S` é suficiente se mostrar a mensagem e a área relevante. Para uma página inteira, abra as ferramentas com `F12`, use `Ctrl + Shift + P` e escolha `Capture full size screenshot`.

## Comentários no código

Os arquivos HTML, CSS e JavaScript usados nesta etapa possuem comentários nos blocos, funções, decisões de validação e trechos que conectam módulos, eventos e comunicação assíncrona. O arquivo JSON permanece sem comentários porque o formato JSON não permite comentários válidos.

## Versão da entrega

Tag Git: `etapa-05`.
