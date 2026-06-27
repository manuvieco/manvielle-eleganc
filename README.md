# Manvielle Elegance

Catálogo institucional e administrativo para uma empresa fictícia de papelaria premium, convites, lembranças personalizadas, casamentos e festas de 15 anos.

O projeto foi desenvolvido para disciplina acadêmica com foco em padrão MVC, CRUD, autenticação administrativa, banco de dados PostgreSQL via Neon e apresentação visual responsiva.

Atendimento da loja: Cidade Ocidental-GO, WhatsApp (61) 99547-8540.

## Objetivo acadêmico

Demonstrar, em um sistema simples e apresentável, a separação de responsabilidades do padrão MVC:

- **Models** acessam o banco de dados.
- **Controllers** recebem a requisição, validam dados e definem o fluxo.
- **Routes** mapeiam URLs para controllers.
- **Views** exibem as informações com EJS.

## Funcionalidades

### Área pública

- Página inicial com hero section, chamada para ação e destaques.
- Página sobre com história fictícia, missão, visão, valores e diferenciais.
- Página de produtos e serviços com busca por nome/categoria e filtro por tipo.
- Botão de compra nos cards direcionando para o WhatsApp da loja.
- Página de contato com validação backend e mensagem de sucesso.
- Layout responsivo para desktop e mobile.

### Área administrativa

- Login de administrador com senha criptografada usando bcrypt.
- Sessão com express-session.
- Middleware protegendo as rotas administrativas.
- Dashboard com total de itens, produtos, serviços e itens ativos.
- Cadastro, edição, exclusão, listagem e pesquisa de produtos/serviços.
- Validação backend de campos obrigatórios.
- Mensagens amigáveis de sucesso e erro.

## Tecnologias utilizadas

- Node.js
- Express
- EJS
- CSS moderno
- Neon PostgreSQL
- pg
- bcryptjs
- express-session
- connect-flash
- nodemon

## Estrutura do projeto

```text
manvielle-elegance/
|-- config/
|   |-- database.js
|   `-- session.js
|-- controllers/
|   |-- adminController.js
|   |-- authController.js
|   |-- productController.js
|   `-- publicController.js
|-- database/
|   `-- schema.sql
|-- middlewares/
|   `-- authMiddleware.js
|-- models/
|   |-- ProductModel.js
|   `-- UserModel.js
|-- public/
|   |-- css/
|   |   `-- styles.css
|   |-- images/
|   |   `-- products-real/
|   `-- js/
|       `-- main.js
|-- routes/
|   |-- adminRoutes.js
|   |-- authRoutes.js
|   |-- productRoutes.js
|   `-- publicRoutes.js
|-- scripts/
|   `-- seed.js
|-- views/
|   |-- admin/
|   |-- auth/
|   |-- layouts/
|   |-- partials/
|   `-- public/
|-- .env.example
|-- package.json
|-- README.md
|-- render.yaml
`-- server.js
```

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Configure a variável `DATABASE_URL` do Neon no `.env`.

4. Rode o projeto em modo desenvolvimento:

```bash
npm run dev
```

5. Acesse:

```text
http://localhost:3000
```

## Como configurar o Neon

1. Acesse o painel do Neon.
2. Crie ou selecione um projeto PostgreSQL.
3. Copie a connection string do banco.
4. Preencha o `.env`:

```env
DATABASE_URL=postgresql://usuario:senha@host/neondb?sslmode=require&channel_binding=require
```

5. Execute o SQL de criação das tabelas:

```bash
npm run db:schema
```

Também é possível copiar o conteúdo de `database/schema.sql` e executar no console SQL do Neon.

## Criar administrador inicial e dados de exemplo

No `.env`, ajuste os dados do administrador:

```env
ADMIN_NAME=Administrador Manvielle
ADMIN_EMAIL=admin@manvielleelegance.com.br
ADMIN_PASSWORD=admin123
```

Depois execute:

```bash
npm run seed
```

O seed cria ou atualiza o administrador e adiciona os itens iniciais:

- Convite de Casamento em Acetato
- Caixa para Padrinhos
- Manual de Madrinhas
- Lembrança Personalizada
- Identidade Visual para Evento
- Menu de Casamento
- Tags Personalizadas
- Papelaria Premium para 15 anos

## Fotos reais dos produtos

O site procura primeiro as fotos reais em:

```text
public/images/products-real/
```

Use estes nomes de arquivo:

```text
papelaria-15-anos.jpg
tags-personalizadas.jpg
menu-casamento.jpg
identidade-visual-evento.jpg
manual-madrinhas.jpg
lembranca-personalizada.jpg
caixa-padrinhos.jpg
convite-acetato.jpg
```

Também são aceitas as extensões `.png` e `.webp`.

Caso uma foto real ainda não exista, o sistema usa automaticamente uma imagem de capa do próprio catálogo. Isso evita imagem quebrada durante a apresentação.

Para conferir se todas as fotos reais foram encontradas:

```bash
npm run check:images
```

## Variáveis de ambiente

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://usuario:senha@host/neondb?sslmode=require&channel_binding=require
SESSION_SECRET=troque-por-um-segredo-grande
STORE_WHATSAPP_NUMBER=5561995478540
ADMIN_NAME=Administrador Manvielle
ADMIN_EMAIL=admin@manvielleelegance.com.br
ADMIN_PASSWORD=admin123
```

Nunca envie o arquivo `.env` para o GitHub.

## Rotas principais

### Públicas

- `GET /`
- `GET /sobre`
- `GET /produtos-servicos`
- `GET /contato`
- `POST /contato`

### Administrativas

- `GET /login`
- `POST /login`
- `GET /admin`
- `GET /admin/items`
- `GET /admin/items/new`
- `POST /admin/items`
- `GET /admin/items/:id/edit`
- `POST /admin/items/:id`
- `POST /admin/items/:id/delete`
- `POST /logout`

## Publicação gratuita

A opção mais simples para este projeto Express é usar **Render** com banco no **Neon**.

### Deploy no Render

1. Suba o projeto para um repositório no GitHub.
2. No Render, crie um novo **Web Service**.
3. Conecte o repositório.
4. Configure:

```text
Build Command: npm install
Start Command: npm start
```

5. Adicione as variáveis de ambiente:

```text
NODE_ENV=production
DATABASE_URL=...
SESSION_SECRET=...
STORE_WHATSAPP_NUMBER=5561995478540
```

6. Faça o deploy.

O arquivo `render.yaml` já foi incluído como apoio para deploy via Blueprint.

### Observação sobre Vercel e Netlify

Vercel e Netlify funcionam melhor para aplicações frontend ou funções serverless. Como este projeto usa Express com sessão em servidor, o Render é mais direto para apresentação acadêmica.

## Prints esperados

Adicione os prints no README após rodar o projeto:

```text
docs/screenshots/home.png
docs/screenshots/catalogo.png
docs/screenshots/login.png
docs/screenshots/dashboard.png
docs/screenshots/crud.png
```

Sugestões de telas:

- Página inicial.
- Página produtos/serviços com busca.
- Login administrativo.
- Dashboard.
- Tela de cadastro/edição.

## Sugestão de commits

```text
chore: estrutura inicial do projeto
feat: criação das rotas públicas
feat: criação do layout visual responsivo
feat: configuração do banco Neon PostgreSQL
feat: implementação do login administrativo
feat: implementação do CRUD de produtos e serviços
feat: implementação da pesquisa e filtros
docs: criação do README com instruções do projeto
style: ajustes finais de responsividade e identidade visual
deploy: configuração para publicação gratuita
```

## Checklist dos requisitos

- [x] Página inicial
- [x] Página sobre
- [x] Página produtos/serviços
- [x] Página contato
- [x] Botão de compra via WhatsApp
- [x] Login administrativo
- [x] CRUD de produtos e serviços
- [x] Pesquisa
- [x] Padrão MVC
- [x] Banco de dados
- [x] README
- [x] Responsividade
- [x] Deploy gratuito

## Qualidade técnica

- Rotas separadas dos controllers.
- Controllers com try/catch e validação backend.
- Models isolando acesso ao Neon PostgreSQL.
- Senha criptografada com bcrypt.
- Rotas administrativas protegidas por middleware.
- Variáveis sensíveis fora do código.
- Views EJS com layouts e partials reutilizáveis.
- CSS próprio sem dependência de Bootstrap.
- Assets visuais próprios para todos os produtos do catálogo inicial.

## Créditos visuais

As fotos do catálogo foram fornecidas pelo autor do projeto e organizadas como assets locais em `public/images/products-real/`.

## Autor

Desenvolvido por **Seu nome** para projeto final acadêmico.
