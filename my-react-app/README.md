# React + TypeScript + Vite

## Pedidos pelo WhatsApp

O servidor de desenvolvimento abre em `http://127.0.0.1:5174/`. Este endereço explícito evita confundir o projeto com outra aplicação em `localhost:5173`.

Os clientes podem adicionar itens do menu, ajustar quantidades e rever o pedido antes de abrir o WhatsApp com a mensagem preenchida. O cliente envia a mensagem no WhatsApp; abrir a conversa não confirma nem envia automaticamente o pedido.

O número público do café é definido por `VITE_WHATSAPP_NUMBER` no ficheiro `.env`, incluído no repositório para funcionar tanto localmente como nos builds publicados. Edite esse ficheiro com o número internacional (apenas dígitos) e reinicie o servidor de desenvolvimento ou faça um novo build. O número aparece no resumo do pedido. Sem um número válido, o botão fica visível mas desativado; não há número alternativo.

`.env.local` serve apenas para substituições locais e não é publicado. Não defina aí um valor vazio para `VITE_WHATSAPP_NUMBER`, pois esse valor substituiria o número de `.env`. `.env.example` contém apenas instruções para estas substituições opcionais.

As quantidades ficam guardadas no `sessionStorage` desta aba, para não se perderem ao visitar a galeria ou recarregar a página. Nome e observações não são guardados.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
