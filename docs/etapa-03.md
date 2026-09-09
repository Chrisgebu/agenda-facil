# Etapa 03 - Interface Responsiva com CSS

## Interfaces apresentadas

As três interfaces desenvolvidas na Etapa 02, que foram utilizadas.

1. `src/index.html` - Agenda diária.
2. `src/agendamento.html` - Formulário de novo agendamento.
3. `src/clientes.html` - Listagem e formulário de clientes.

## Viewports e evidências

As capturas de tela estão em `docs/evidencias/etapa-03/` e utilizam os seguintes viewports:

| Viewport | Dimensão | Arquivos |
| --- | --- | --- |
| Desktop | 1440 x 900 px | `desktop-tela-01.png`, `desktop-tela-02.png`, `desktop-tela-03.png` |
| Tablet | 768 x 1024 px | `tablet-tela-01.png`, `tablet-tela-02.png`, `tablet-tela-03.png` |
| Smartphone | 390 x 844 px | `smartphone-tela-01.png`, `smartphone-tela-02.png`, `smartphone-tela-03.png` |

Em cada grupo, as telas 01, 02 e 03 correspondem, respectivamente, à agenda diária, ao novo agendamento e aos clientes.

## Breakpoints utilizados

- `900px`: adaptação para tablet e telas menores. O cabeçalho passa a organizar título e menu em coluna, e os campos dos formulários e os atalhos passam para uma coluna.
- `480px`: adaptação para smartphone. O menu fica em coluna, os botões ocupam a largura disponível e os espaçamentos e títulos são reduzidos para preservar a leitura.

## Decisões de responsividade

- O cabeçalho e as ações dos formulários usam Flexbox para distribuir e reorganizar seus elementos.
- Os atalhos da página inicial e os grupos de campos dos formulários usam CSS Grid.
- Em telas maiores, os atalhos e os campos relacionados podem ficar lado a lado. Em telas menores, eles ficam em uma única coluna.
- Os campos de formulário ocupam 100% da largura disponível, facilitando o uso em smartphone.

## Arquivo CSS responsável

Os estilos e as media queries estão centralizados em `src/styles.css`.
