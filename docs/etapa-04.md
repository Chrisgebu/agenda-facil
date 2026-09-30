# Etapa 04 - Interatividade com JavaScript

## Objetivo

Adicionar interatividade ao AgendaFácil, permitindo cadastrar e pesquisar clientes, criar agendamentos, consultar a agenda por data e cancelar atendimentos. A estrutura HTML e a apresentação responsiva das etapas anteriores foram mantidas.

## Execução

A aplicação utiliza HTML, CSS e JavaScript, sem dependências externas na interface. Para compartilhar os cadastros entre as três páginas, execute os arquivos com um servidor HTTP local, mantendo a mesma URL, porta e navegador durante os testes.

Uma opção é abrir a pasta do repositório no Visual Studio Code e iniciar `src/index.html` com a extensão Live Server.

Outra opção, com Python 3 instalado, é executar na pasta do repositório:

```text
python -m http.server 5500 --bind 127.0.0.1
```

Depois, acessar `http://127.0.0.1:5500/src/index.html`. No Windows, o comando `py` também pode ser utilizado no lugar de `python`, caso seja o comando disponível na instalação.

Os dados são guardados em `localStorage` e continuam disponíveis após atualizar a página. Esse armazenamento é local ao navegador: ele não sincroniza dados entre dispositivos e não substitui o banco de dados previsto na proposta. O servidor HTTP apenas disponibiliza os arquivos; os cadastros, consultas e validações desta etapa são executados pelo JavaScript no navegador.

## Funcionalidades interativas

### 1. Cadastro de clientes

O formulário lê nome, telefone e e-mail, valida os valores e insere um objeto no array de clientes. A lista e o contador são atualizados imediatamente, e uma mensagem confirma o cadastro. O e-mail é opcional, conforme a proposta inicial.

Arquivos: `src/clientes.html`, `src/js/clientes.js` e `src/js/comum.js`.

Conceitos: evento `submit`, `preventDefault`, funções, objetos, arrays, spread, condicionais, `some`, `createElement`, `textContent` e `appendChild`.

### 2. Pesquisa de clientes

Ao digitar no campo de pesquisa, o evento `input` aplica `filter` ao array. A busca considera parte do nome e ignora diferenças entre maiúsculas e minúsculas. O resultado e o contador mudam sem recarregar a página. Quando não há correspondência, é exibido o estado vazio.

Arquivos: `src/clientes.html` e `src/js/clientes.js`.

Conceitos: evento `input`, `filter`, `includes`, `toLowerCase`, `forEach` e manipulação do DOM.

### 3. Criação de agendamentos

Os clientes cadastrados aparecem nas opções do formulário. Após selecionar um cliente e informar serviço, duração, data e horário, o JavaScript valida os campos e verifica conflitos com os atendimentos já registrados. Um agendamento válido é incluído no array e fica disponível na página Agenda.

Arquivos: `src/agendamento.html`, `src/js/agendamento.js` e `src/js/comum.js`.

Conceitos: evento `submit`, funções, arrays de objetos, `find`, `some`, operadores lógicos, conversão com `Number`, cálculos de horários e `Date`.

### 4. Consulta da agenda por data

O botão Ver agenda filtra os agendamentos pela data informada e atualiza a lista. Os atendimentos são ordenados por data e horário. O botão Mostrar todos remove o filtro e volta a apresentar todos os registros. Quando não há atendimentos, é exibida uma mensagem em vez de uma lista vazia sem explicação.

Arquivos: `src/index.html`, `src/js/agenda.js` e `src/js/comum.js`.

Conceitos: eventos `submit` e `click`, `filter`, `sort`, `forEach`, `replaceChildren`, `createElement` e `textContent`.

### 5. Cancelamento de agendamentos

O botão Cancelar agendamento altera o status para Cancelado. O card muda de aparência e o botão deixa de ser apresentado. O registro permanece no histórico, e o período deixa de bloquear novos atendimentos.

Arquivos: `src/index.html`, `src/js/agenda.js`, `src/js/comum.js` e `src/styles.css`.

Conceitos: evento `click`, funções, `map`, spread e `classList.toggle`.

## Organização do JavaScript

- `src/js/comum.js`: leitura e gravação dos dados, mensagens, criação segura de elementos e formatação de data e horário.
- `src/js/clientes.js`: cadastro, validação, pesquisa e apresentação dos clientes.
- `src/js/agendamento.js`: opções de clientes, validação e criação de agendamentos.
- `src/js/agenda.js`: listagem, ordenação, filtro e cancelamento de atendimentos.

Os scripts são vinculados no HTML com `defer`. Os eventos são registrados com `addEventListener`. Os textos fornecidos pelo usuário são inseridos com `textContent`, sem serem interpretados como HTML.

## Validações e situações inválidas

| Situação | Tratamento |
| --- | --- |
| Nome ou serviço vazio, composto apenas por espaços ou com menos de 2 caracteres | Exibe erro e impede o cadastro. O limite é de 80 caracteres. |
| Telefone sem DDD, com letras ou fora de 10 a 11 dígitos | Exibe erro e impede o cadastro. Espaços, parênteses e hífen são aceitos na formatação. |
| E-mail preenchido em formato inválido | Exibe erro. O campo pode ficar vazio. |
| Telefone de um cliente já cadastrado | Impede o cadastro duplicado, desconsiderando a formatação do telefone. |
| Agendamento sem um cliente cadastrado selecionado | Exibe erro e orienta a selecionar um cliente. Se não houver clientes, a tela indica o link para o cadastro. |
| Data ou horário ausentes ou no passado | Exibe erro e impede o agendamento. |
| Duração inválida | Aceita somente números inteiros de 15 a 480 minutos, em múltiplos de 15. |
| Atendimento que terminaria depois do fim do dia | Exibe erro e impede o agendamento. |
| Sobreposição total ou parcial com atendimento confirmado | Exibe erro e mantém a agenda sem alteração. Atendimentos consecutivos são permitidos. |
| Observações com mais de 300 caracteres | O HTML limita o campo, e o JavaScript também verifica o limite. |
| Consulta da agenda sem uma data | Exibe erro e mantém a listagem anterior. |
| Pesquisa ou filtro sem resultados | Exibe uma mensagem de estado vazio. |
| Falha na leitura ou gravação do armazenamento local | Exibe mensagem de erro e não informa sucesso. Se a leitura falhar, o botão de envio é desativado. |

As validações dos cadastros são realizadas no JavaScript. O atributo `novalidate` permite mostrar as mensagens da aplicação, enquanto os tipos dos campos e os limites do HTML continuam auxiliando na entrada dos dados.

## Matriz de evidências

As funções indicadas estão nos arquivos JavaScript. As capturas correspondem ao roteiro de teste descrito a seguir e devem ser salvas em `docs/evidencias/etapa-04/`.

| Requisito | Funcionalidade relacionada | Arquivo(s) | Evidência |
| --- | --- | --- | --- |
| Manipulação do DOM | Cadastro e listagem de clientes | `src/js/clientes.js`, `src/js/comum.js` | `exibirClientes` cria os cards com `createElement` e `appendChild`. Captura [01-clientes-cadastrados.png](evidencias/etapa-04/01-clientes-cadastrados.png). |
| Tratamento de eventos | Cadastro, pesquisa e consulta | `src/js/clientes.js`, `src/js/agendamento.js`, `src/js/agenda.js` | `addEventListener` trata `submit`, `input` e `click`. Capturas [02-pesquisa-clientes.png](evidencias/etapa-04/02-pesquisa-clientes.png) e [07-agenda-filtrada.png](evidencias/etapa-04/07-agenda-filtrada.png). |
| Validação de formulários | Cadastro de clientes e agendamentos | `src/js/clientes.js`, `src/js/agendamento.js` | `cadastrarCliente` e `cadastrarAgendamento` impedem o envio de dados inválidos. Capturas [03-cliente-invalido.png](evidencias/etapa-04/03-cliente-invalido.png) e [05-data-invalida.png](evidencias/etapa-04/05-data-invalida.png). |
| Alteração dinâmica da interface | Pesquisa, filtro e cancelamento | `src/js/clientes.js`, `src/js/agenda.js`, `src/styles.css` | A lista e os contadores mudam; `classList.toggle` altera a aparência do card cancelado. Captura [09-agendamento-cancelado.png](evidencias/etapa-04/09-agendamento-cancelado.png). |
| Uso de funções | Cadastro, exibição e mensagens | `src/js/comum.js`, `src/js/clientes.js`, `src/js/agendamento.js`, `src/js/agenda.js` | Funções nomeadas `mostrarMensagem`, `exibirClientes`, `cadastrarAgendamento`, `exibirAgenda` e `cancelarAgendamento`. Captura [04-agendamento-salvo.png](evidencias/etapa-04/04-agendamento-salvo.png). |
| Uso de arrays | Coleções de clientes e agendamentos | `src/js/clientes.js`, `src/js/agendamento.js`, `src/js/agenda.js` | Arrays `clientes`, `agendamentos` e `agenda`, com objetos para cada registro. Novos itens são incluídos com spread. Capturas 01 e 07. |
| Métodos de iteração | Pesquisa, validação, listagem e cancelamento | `src/js/clientes.js`, `src/js/agendamento.js`, `src/js/agenda.js` | `filter` seleciona resultados; `forEach` cria os elementos; `some` verifica duplicidade e conflito; `map` altera o status. Capturas 02, 06 e 09. |
| Tratamento de situações inválidas | Validações e estados sem resultados | `src/js/clientes.js`, `src/js/agendamento.js`, `src/js/agenda.js`, `src/js/comum.js` | Mensagens de erro, retornos antes de salvar e estado vazio. Capturas [06-horario-ocupado.png](evidencias/etapa-04/06-horario-ocupado.png) e [08-agenda-sem-resultados.png](evidencias/etapa-04/08-agenda-sem-resultados.png). |

## Roteiro para testar e registrar as evidências

Use apenas dados fictícios e mantenha uma única aba para os testes. As datas abaixo são exemplos: escolha três datas futuras consecutivas caso 10, 11 e 12 de outubro de 2026 já tenham passado. Utilize essas mesmas datas em todos os testes relacionados.

O enunciado não define quantidade nem dimensões obrigatórias para as capturas. Este roteiro utiliza nove imagens para mostrar as funcionalidades, os erros tratados e os estados da interface.

1. Em Clientes, cadastre `Ana Teste`, telefone `(11) 99999-1111` e e-mail `ana@example.com`. Depois, cadastre `Bruno Teste`, telefone `(11) 98888-2222` e e-mail `bruno@example.com`. Capture a lista com os dois clientes e o contador. Salve como `01-clientes-cadastrados.png`.
2. No campo Pesquisar por nome, digite `ana`. A lista deve mostrar apenas Ana, e o contador deve informar um cliente exibido de dois cadastrados. Capture como `02-pesquisa-clientes.png` e depois apague a pesquisa.
3. No formulário de cliente, preencha nome `Carla Teste`, telefone `123` e e-mail `carla@example.com`. Clique em Salvar cliente. A mensagem deve indicar telefone inválido, e a lista deve continuar com dois clientes. Capture como `03-cliente-invalido.png`. Depois, use Limpar campos.
4. Em Novo agendamento, selecione Ana, informe serviço `Corte`, duração `30`, data `10/10/2026` e horário `10:00`. Salve e capture a confirmação como `04-agendamento-salvo.png`.
5. Ainda no formulário, selecione Bruno, serviço `Barba`, duração `30`, data `01/01/2020` e horário `10:15`. Clique em Salvar agendamento. Capture a mensagem de data e horário futuros como `05-data-invalida.png`.
6. Sem alterar os demais campos, troque somente a data para `10/10/2026` e tente salvar. O período 10:15-10:45 se sobrepõe ao atendimento de Ana, que vai de 10:00 a 10:30. Capture o erro como `06-horario-ocupado.png`. Depois, troque a data para `11/10/2026` e salve esse agendamento de Bruno.
7. Abra Agenda, selecione `10/10/2026` e clique em Ver agenda. Apenas o atendimento de Ana deve aparecer; o contador deve mostrar um resultado e a data consultada. Capture como `07-agenda-filtrada.png`.
8. Troque o filtro para `12/10/2026`, ou outra data sem cadastros, e consulte. Capture a mensagem Nenhum agendamento encontrado como `08-agenda-sem-resultados.png`.
9. Volte a consultar `10/10/2026` e clique em Cancelar agendamento. Capture a confirmação e o card com Status: Cancelado, sem o botão de cancelamento, como `09-agendamento-cancelado.png`.

Salve os nove arquivos dentro de `docs/evidencias/etapa-04/`. No Chrome ou Edge, é possível capturar a página inteira com F12, Ctrl+Shift+P e a opção Capture full size screenshot. A captura deve incluir a mensagem e a área da interface que permite verificar o resultado.

### Verificações complementares

- Tentar enviar os formulários vazios ou com nomes e serviços compostos apenas por espaços.
- Preencher um telefone válido e um e-mail inválido, como `email-invalido`.
- Tentar cadastrar novamente o telefone de Ana, com outra formatação, como `11999991111`.
- Pesquisar um nome não cadastrado e observar o estado vazio.
- Tentar agendar sem selecionar cliente, sem data ou sem horário.
- Tentar informar duração `17`, `0` ou `500`.
- Tentar um atendimento com início às `23:45` e duração de `30` minutos.
- Clicar em Ver agenda com o campo de data vazio.
- Clicar em Mostrar todos e verificar que os registros de ambas as datas aparecem.
- Atualizar a página e verificar que clientes, agendamentos e status permanecem salvos.
- Agendar novamente o período do atendimento cancelado e verificar que o horário foi liberado.
- Conferir os menus e formulários em uma tela estreita, mantendo a responsividade da Etapa 03.

## Versão da entrega

Tag Git: `etapa-04`.
