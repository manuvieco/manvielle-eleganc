// Carrega variáveis de ambiente do arquivo .env para uso no servidor.
require('dotenv').config();

// Importa módulos principais do Node e do Express.
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');

// Importa configurações e rotas da aplicação.
const sessionConfig = require('./config/session');
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const { ensureAuthenticated } = require('./middlewares/authMiddleware');
const { resolveProductImageUrl } = require('./utils/productImages');
const storeInfo = require('./config/store');

// Cria a instância principal do Express.
const app = express();
// Define a porta padrão para o servidor.
const PORT = process.env.PORT || 3000;

// Configurações de visualização do Express.
app.set('trust proxy', 1); // Configuração para funcionar atrás de proxy (ex: Vercel / proxies reversos).
app.set('view engine', 'ejs'); // Usa EJS como mecanismo de template.
app.set('views', path.join(__dirname, 'views')); // Define o diretório onde estão as views.
app.set('layout', 'layouts/main'); // Define o layout padrão usado nas páginas.

// Middleware e parse de requisições.
app.use(expressLayouts); // Habilita layouts EJS.
app.use(express.urlencoded({ extended: true })); // Permite parsing de dados de formulários.
app.use(express.json()); // Permite parsing de JSON no corpo da requisição.
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos da pasta public.
app.use(sessionConfig); // Configuração de sessão para login e flash messages.
app.use(flash()); // Suporta mensagens flash entre redirecionamentos.

// Middleware global para fornecer variáveis úteis a todas as views.
app.use((req, res, next) => {
  res.locals.currentPath = req.path; // Caminho atual para destacar navegação.
  res.locals.user = req.session.user || null; // Usuário logado disponível nas views.
  res.locals.messages = {
    success: req.flash('success'), // Mensagens de sucesso enfileiradas.
    error: req.flash('error') // Mensagens de erro enfileiradas.
  };
  res.locals.storeInfo = storeInfo; // Dados da loja disponíveis nas views.

  // Função para formatar valores em reais.
  res.locals.formatCurrency = (value) => {
    const number = Number(value || 0);
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Função para formatar datas em padrão brasileiro.
  res.locals.formatDate = (value) => {
    if (!value) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(value));
  };

  // Monta URL de WhatsApp com mensagem personalizada para cada produto.
  res.locals.buildWhatsAppUrl = (item = {}) => {
    const itemName = item.name ? ` sobre ${item.name}` : '';
    const message = `Olá! Tenho interesse${itemName} da ${storeInfo.name}. Pode me passar mais informações?`;

    return `https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  // Função que resolve a URL da imagem do produto para uso nas views.
  res.locals.resolveProductImageUrl = resolveProductImageUrl;
  next();
});

// Rotas públicas e administrativas.
app.use('/', publicRoutes); // Rotas públicas do site.
app.use('/', authRoutes); // Rotas de autenticação.
app.use('/admin', ensureAuthenticated, adminRoutes); // Rotas administrativas protegidas.
app.use('/admin/items', ensureAuthenticated, productRoutes); // Rotas de gerenciamento de produtos.

// Tratamento de rota não encontrada (404).
app.use((req, res) => {
  res.status(404).render('public/404', {
    pageTitle: 'Página não encontrada',
    layout: 'layouts/main'
  });
});

// Tratamento de erro global.
app.use((error, req, res, next) => {
  console.error(error); // Registra erro no console.
  res.status(500).render('public/error', {
    pageTitle: 'Erro interno',
    layout: 'layouts/main',
    errorMessage: 'Não foi possível concluir a solicitação agora. Tente novamente em alguns instantes.'
  });
});

// Inicia o servidor apenas em ambiente local.
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`${storeInfo.name} rodando em http://localhost:${PORT}`);
  });
}

// Exporta a aplicação para testes ou deploys que usem outro servidor.
module.exports = app;