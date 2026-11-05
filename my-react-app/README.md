# Bean Maputo

Site do café com menu, galeria, localização e pedidos pelo WhatsApp.

## Desenvolvimento

```sh
npm ci
npm run dev
```

Abra `http://127.0.0.1:5174/`. Este endereço evita confundir o projeto com outra
aplicação em `localhost:5173`.

## Estrutura

- `src/BeanPage.tsx`: composição da página inicial e estado do pedido.
- `src/data/menu.ts`: categorias, pratos, IDs permanentes e preços numéricos em
  MT.
- `src/menu/MenuSection.tsx`: apresentação das categorias e dos pratos.
- `src/menu/useMenuCarousel.ts`: navegação, gestos e altura do menu, incluindo
  as correções para Safari.
- `src/order.ts` e `src/useOrderCart.ts`: catálogo, cálculos, mensagem e
  armazenamento do pedido.
- `src/OrderDialog.tsx` e `src/QuantityControl.tsx`: resumo e controlos de
  quantidade.
- `src/SiteHeader.tsx`: navegação partilhada e menu móvel.
- `src/GalleryPage.tsx`: galeria e ampliação de fotografias.
- `src/index.css`: tema, tipografia e estilos globais. Os restantes estilos
  ficam junto do componente ou página correspondente.
- `assets/originals/`: imagens de origem; `public/`: versões otimizadas
  publicadas.
- `tests/order.test.ts`: regras de preços, pedidos, recuperação de dados e
  WhatsApp.
- `tests/browser/`: verificações da experiência no Chromium e no WebKit com
  dimensões de iPhone.

## Editar o menu

Cada prato tem `id`, `name`, `description` e `price`. O preço é um número, por
exemplo `price: 430`, sem texto `MT` nem separadores de milhares. A formatação é
feita apenas na apresentação.

Mantenha o `id` quando alterar o nome, a descrição ou o preço. Use o mesmo ID
para o mesmo prato repetido em dois grupos; use IDs diferentes para variantes.
IDs repetidos com dados diferentes ou preços inválidos impedem a criação do
catálogo.

As quantidades ficam no `sessionStorage` da aba e sobrevivem a recarregamentos e
visitas à galeria. Pedidos antigos são migrados para os IDs permanentes com os
preços atuais. Nome e observações não são guardados.

## Número do WhatsApp

O número público do café está em `VITE_WHATSAPP_NUMBER` no ficheiro `.env`,
incluído no repositório para funcionar localmente e no site publicado. Use o
número internacional com indicativo do país. Depois de o alterar, reinicie o
servidor ou faça um novo build.

`.env.local` permite substituições apenas locais e não é publicado. Um valor
vazio nesse ficheiro também substitui o número de `.env`. `.env.example` explica
esta configuração.

O cliente escolhe os itens e revê o pedido. O botão abre a conversa com a
mensagem preenchida; o cliente ainda precisa de a enviar no WhatsApp. Abrir a
conversa não confirma o pedido. Sem um número válido, o botão continua visível
mas fica desativado. Não existe número alternativo.

## Verificação e publicação

Instale os navegadores de teste uma vez:

```sh
npx playwright install chromium webkit
```

Depois execute:

```sh
npm run check
```

Este comando verifica lint, testes das regras de pedidos, build de produção e
testes de navegador. Os testes abrem uma pré-visualização isolada em
`127.0.0.1:4175`, sem usar o servidor de desenvolvimento. Os links do WhatsApp
são intercetados e não enviam mensagens.

Os testes do menu cobrem mudanças de categoria no fundo da lista, gestos
mantidos, movimento vertical, teclado, redimensionamento e ecrãs estreitos. O
WebKit simula os eventos de toque e a região de deslocamento; uma verificação
num iPhone físico continua a ser útil para gestos nativos do Safari.

O workflow `.github/workflows/pages.yml` executa estas verificações antes de
publicar no GitHub Pages, incluindo o caminho base do repositório. A galeria
também aceita acesso direto a `/galeria/`.
