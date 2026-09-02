# Etapa 02 - Protótipo Estrutural com HTML Semântico

## Objetivo da etapa

Esta etapa transforma a proposta do AgendaFácil em um primeiro protótipo de interface Web. O foco é representar o domínio de agendamentos por meio de páginas organizadas e semanticamente coerentes, sem implementar persistência de dados ou regras de negócio completas.

## Funcionalidades implementadas

1. Navegação entre as interfaces principais do protótipo.
2. Consulta estrutural de agenda por data e apresentação do estado vazio de agendamentos.
3. Atalhos para as páginas de agendamento e clientes.
4. Formulário estrutural para preenchimento de um novo agendamento.
5. Página de clientes com estado vazio e formulário estrutural de cadastro.

Os formulários e botões não persistem dados nesta etapa. Eles representam a estrutura que será conectada à lógica da aplicação nas próximas entregas.

## Páginas criadas

### `src/index.html` - Agenda diária

Página inicial do protótipo. Possui um campo de data, uma área reservada para os agendamentos e atalhos para as outras duas páginas. A consulta da agenda será conectada aos dados em uma etapa futura.

### `src/agendamento.html` - Novo agendamento

Página de formulário para registrar um novo agendamento. Possui campos para cliente, serviço, data, horário e observações, com `label` associado a cada campo e botões para salvar ou limpar o formulário.

### `src/clientes.html` - Clientes

Página de clientes. Exibe o estado vazio de clientes cadastrados e possui um formulário estrutural com nome, telefone e e-mail. O cadastro será conectado à persistência de dados em uma etapa futura.

## Decisões relacionadas à estrutura HTML

- Todas as páginas possuem `header`, `nav`, `main` e `footer`, criando uma estrutura comum de navegação.
- As áreas principais das páginas foram separadas com `section` e títulos associados por `aria-labelledby` quando apropriado.
- Os atalhos da página inicial usam elementos `article`, pois cada um possui uma finalidade própria e pode ser compreendido separadamente.
- Os formulários utilizam `form`, `fieldset`, `legend`, `label`, `input`, `textarea` e `button`. Cada `label` possui um atributo `for` associado ao `id` do seu campo correspondente.
- A lista de links do menu utiliza `nav` e uma lista não ordenada, pois representa a navegação principal do sistema.
- O CSS foi mantido separado em `src/styles.css` e contém apenas estilos básicos de leitura, espaçamento, navegação e formulários. Ele não possui JavaScript nem cria funcionalidades adicionais.

## Estrutura de arquivos da Etapa 02

```text
agenda-facil/
├── README.md
├── docs/
│   ├── proposta.md
│   └── README-etapa-02.md
└── src/
    ├── index.html
    ├── agendamento.html
    ├── clientes.html
    └── styles.css
```

## Itens fora do escopo nesta etapa

- Banco de dados e persistência.
- API e servidor.
- Autenticação.
- JavaScript complexo.
- Validação dinâmica de conflitos de horário.
