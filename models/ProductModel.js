// Modelo de dados para gerenciar operações de CRUD sobre a tabela items.
const database = require('../config/database');

const VALID_TYPES = ['Produto', 'Serviço'];
const VALID_STATUS = ['Ativo', 'Inativo'];

function normalizeSearchTerm(term = '') {
  return String(term).trim().replace(/[,%]/g, ''); // Remove caracteres problemáticos para a busca.
}

class ProductModel {
  static async findAll(filters = {}) {
    const search = normalizeSearchTerm(filters.search);
    const type = filters.type && VALID_TYPES.includes(filters.type) ? filters.type : null;
    const conditions = [];
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ilike $${params.length} or category ilike $${params.length} or type ilike $${params.length})`);
    }

    if (type) {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }

    if (filters.status && VALID_STATUS.includes(filters.status)) {
      params.push(filters.status);
      conditions.push(`status = $${params.length}`);
    }

    const whereClause = conditions.length ? `where ${conditions.join(' and ')}` : '';
    let sql = `
      select id, name, type, category, description, price, image_url, status, created_at, updated_at
      from items
      ${whereClause}
      order by created_at desc
    `;

    if (filters.limit) {
      params.push(Number(filters.limit));
      sql += ` limit $${params.length}`;
    }

    const result = await database.query(sql, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await database.query(
      `
        select id, name, type, category, description, price, image_url, status, created_at, updated_at
        from items
        where id = $1
      `,
      [id]
    );

    return result.rows[0] || null;
  }

  static async create(item) {
    const result = await database.query(
      `
        insert into items (name, type, category, description, price, image_url, status)
        values ($1, $2, $3, $4, $5, $6, $7)
        returning id, name, type, category, description, price, image_url, status, created_at, updated_at
      `,
      [item.name, item.type, item.category, item.description, item.price, item.image_url, item.status]
    );

    return result.rows[0];
  }

  static async update(id, item) {
    const result = await database.query(
      `
        update items
        set
          name = $1,
          type = $2,
          category = $3,
          description = $4,
          price = $5,
          image_url = $6,
          status = $7,
          updated_at = now()
        where id = $8
        returning id, name, type, category, description, price, image_url, status, created_at, updated_at
      `,
      [item.name, item.type, item.category, item.description, item.price, item.image_url, item.status, id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    await database.query('delete from items where id = $1', [id]);
    return true;
  }

  static async getStats() {
    const result = await database.query(`
      select
        count(*)::int as total,
        count(*) filter (where type = 'Produto')::int as products,
        count(*) filter (where type = 'Serviço')::int as services,
        count(*) filter (where status = 'Ativo')::int as active
      from items
    `);

    return result.rows[0];
  }
}

module.exports = ProductModel;