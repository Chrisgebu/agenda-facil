# Proposta e Especificação Inicial - AgendaFácil

## 1. Nome da aplicação

**AgendaFácil**

## 2. Descrição do problema

Prestadores de serviços autônomos que trabalham com horários marcados costumam controlar seus atendimentos por conversas em aplicativos de mensagem, anotações em papel ou memória. Essa forma de organização dificulta a visualização dos horários disponíveis, torna mais provável o agendamento duplicado e não mantém, de forma organizada, os dados dos clientes e dos serviços oferecidos.

O AgendaFácil resolverá esse problema ao centralizar clientes, serviços e agendamentos em uma aplicação web. Antes de confirmar um agendamento, o sistema verificará se o período solicitado entra em conflito com outro atendimento já registrado.

## 3. Público-alvo

O público-alvo são prestadores de serviços autônomos ou pequenos negócios que atendem com hora marcada, como barbeiros, manicures, cabeleireiros e professores particulares. Para manter o escopo inicial viável, a primeira versão será voltada à rotina de um único prestador de serviço.

## 4. Objetivo principal

Permitir que um prestador de serviço organize seus clientes, serviços e horários de atendimento de maneira simples e confiável, reduzindo conflitos de agenda e facilitando a consulta dos atendimentos do dia.

## 5. Funcionalidades previstas

1. **Gerenciar clientes:** cadastrar, consultar, editar e desativar os dados de um cliente.
2. **Gerenciar serviços:** cadastrar, consultar, editar e desativar serviços, informando duração estimada e preço.
3. **Criar agendamentos:** selecionar um cliente, um serviço, uma data e um horário para registrar um atendimento.
4. **Validar disponibilidade:** impedir que dois atendimentos ocupem total ou parcialmente o mesmo período de horário.
5. **Consultar agenda diária:** listar os agendamentos de uma data, exibindo horário, cliente, serviço e status.
6. **Remarcar ou cancelar agendamentos:** permitir alteração de data, horário ou serviço, bem como o cancelamento do atendimento.
7. **Atualizar status do atendimento:** registrar se o atendimento foi concluído, cancelado ou se o cliente não compareceu.

## 6. Entidades e conceitos importantes do domínio

### Cliente

Pessoa que contrata um serviço. Terá, inicialmente, nome, telefone, e-mail opcional e situação de cadastro (ativo ou inativo).

### Serviço

Tipo de atendimento oferecido pelo prestador. Terá nome, descrição opcional, duração estimada em minutos, preço e situação de cadastro.

### Agendamento

Registro de um atendimento previsto. Relacionará um cliente a um serviço e armazenará data, horário de início, horário de término calculado a partir da duração do serviço, status e observações opcionais.

### Conflito de horário

Regra de negócio que identifica sobreposição entre o período de um novo agendamento e o período de outro agendamento ativo. Um agendamento em conflito não poderá ser confirmado.

## 7. Telas ou interfaces previstas

### Agenda diária

Tela inicial para selecionar uma data e visualizar os agendamentos daquele dia em ordem de horário. Cada item mostrará horário, cliente, serviço e status, além de ações para editar, remarcar, cancelar ou concluir o atendimento.

### Formulário de agendamento

Tela para criar ou editar um agendamento. O usuário escolherá o cliente, o serviço, a data e o horário. Antes de salvar, a interface mostrará se o horário está disponível ou se há conflito.

### Clientes

Tela para listar e pesquisar clientes cadastrados. Permitirá incluir um novo cliente, editar seus dados e desativar um cadastro sem apagar o histórico de agendamentos.

### Serviços

Tela para listar os serviços oferecidos, com ações para criar, editar ou desativar um serviço e informar sua duração e preço.

## 8. Operações previstas

1. **Cadastrar cliente:** inserir os dados de um novo cliente.
2. **Cadastrar serviço:** inserir um serviço com duração e preço.
3. **Consultar horários disponíveis:** avaliar a agenda da data escolhida para identificar períodos livres.
4. **Agendar atendimento:** criar um agendamento após validar cliente, serviço e ausência de conflito de horário.
5. **Remarcar atendimento:** alterar data, horário ou serviço de um agendamento, realizando nova validação de disponibilidade.
6. **Cancelar atendimento:** alterar o status de um agendamento para cancelado e manter seu registro para consulta posterior.
7. **Concluir atendimento:** alterar o status do agendamento após a realização do serviço.

## 9. Tecnologias planejadas para o cliente

- **React:** construção das interfaces e organização dos componentes.
- **Vite:** criação e execução do projeto de cliente durante o desenvolvimento.
- **JavaScript, HTML e CSS:** implementação da lógica de interface, marcação e estilos.

## 10. Tecnologias planejadas para o servidor

- **Node.js:** ambiente de execução do servidor.
- **Express:** criação da API REST que receberá as solicitações do cliente e aplicará as regras de negócio, especialmente a validação de conflito de horários.
- **JSON sobre HTTP:** formato de comunicação entre cliente e servidor.

## 11. Tecnologia de persistência

- **SQLite:** banco de dados relacional armazenado inicialmente em um arquivo local do projeto.

## 12. Diagrama da visão geral da solução

```text
┌──────────────────────────────┐
│ Usuário: prestador de serviço│
└──────────────┬───────────────┘
               │ usa pelo navegador
               ▼
┌──────────────────────────────┐
│ Cliente web                  │
│ React + Vite                 │
│ Agenda, clientes e serviços  │
└──────────────┬───────────────┘
               │ requisições HTTP / JSON
               ▼
┌──────────────────────────────┐
│ Servidor                     │
│ Node.js + Express            │
│ API e regras de agendamento  │
└──────────────┬───────────────┘
               │ consultas SQL
               ▼
┌──────────────────────────────┐
│ Banco de dados SQLite        │
│ Clientes, serviços e         │
│ agendamentos                 │
└──────────────────────────────┘
```

## Decisões iniciais de escopo

- A primeira versão atenderá um único prestador.
- Agendamentos cancelados não serão apagados; seu status será alterado para preservar o histórico.
- A duração do serviço será usada para calcular o término do atendimento e identificar conflitos de horário.
