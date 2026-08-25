# AgendaFácil

> Projeto Integrador da disciplina Tecnologia de Construção de Software I.

## Descrição

O AgendaFácil será uma aplicação web para que prestadores de serviços autônomos organizem seus horários, clientes, serviços e agendamentos em um só lugar.

## Problema que a aplicação resolve

Pequenos prestadores de serviço frequentemente controlam a agenda por mensagens, anotações ou memória. Isso pode gerar horários duplicados, dificuldade para localizar informações de clientes e pouca visibilidade dos atendimentos do dia. O AgendaFácil centralizará essas informações e verificará conflitos de horário ao criar ou alterar um agendamento.

## Público-alvo

Prestadores de serviços autônomos que trabalham com horários marcados, como barbeiros, manicures, cabeleireiros e professores particulares. Na primeira versão, cada agenda será administrada por um único prestador.

## Objetivo

Permitir o gerenciamento simples e confiável da rotina de agendamentos de um prestador de serviço, reduzindo conflitos de horário e facilitando a consulta da agenda diária.

## Funcionalidades previstas

1. Cadastrar, editar, consultar e desativar clientes.
2. Cadastrar, editar, consultar e desativar serviços, incluindo duração e preço.
3. Criar agendamentos vinculando cliente, serviço, data e horário.
4. Verificar conflitos de horário antes de salvar um agendamento.
5. Visualizar a agenda por dia, com filtros de data e status.
6. Remarcar ou cancelar agendamentos.
7. Registrar o status do atendimento como agendado, concluído, cancelado ou não compareceu.

## Tecnologias planejadas

- Cliente: React, Vite, JavaScript, HTML e CSS.
- Servidor: Node.js e Express, com uma API REST em JSON.
- Persistência: SQLite.

Essas tecnologias são uma previsão para o projeto e poderão ser ajustadas nas próximas etapas, mantendo a coerência da solução.

## Estado atual da Etapa 01

Esta entrega contém a proposta e a especificação inicial do projeto. A implementação da aplicação ainda não foi iniciada; portanto, não há comandos de execução ou testes automatizados nesta etapa.

## Como consultar a documentação

A especificação completa da Etapa 01 está em [docs/proposta.md](docs/proposta.md).

## Limitações conhecidas

- O escopo inicial considera uma agenda para um único prestador de serviço.
- Nesta etapa ainda não haverá autenticação, notificações ou integração com pagamentos.
- O código-fonte, os testes e as evidências de funcionamento serão adicionados nas próximas etapas do projeto.

