// Controller da área administrativa que trata a página inicial do admin.
const ProductModel = require('../models/ProductModel');

async function dashboard(req, res) {
  try {
    // Obtém estatísticas e os últimos itens cadastrados.
    const stats = await ProductModel.getStats();
    const latestItems = await ProductModel.findAll({ limit: 5 });

    return res.render('admin/dashboard', {
      pageTitle: 'Dashboard',
      layout: 'layouts/admin',
      stats,
      latestItems,
      dbError: null
    });
  } catch (error) {
    // Em caso de erro no banco, renderiza o dashboard com dados vazios.
    return res.render('admin/dashboard', {
      pageTitle: 'Dashboard',
      layout: 'layouts/admin',
      stats: {
        total: 0,
        products: 0,
        services: 0,
        active: 0
      },
      latestItems: [],
      dbError: 'Não foi possível carregar os dados. Confira a conexão com o Neon PostgreSQL.'
    });
  }
}

module.exports = {
  dashboard
};