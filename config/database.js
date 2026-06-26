// Configuração de conexão com o PostgreSQL usando o módulo pg.
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL; // URL de conexão definida no .env.

let pool = null;

// Cria o pool de conexões somente quando há uma URL de conexão.
if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Permite conexão SSL com Neon sem validação de certificado local.
    }
  });
}

// Retorna o pool de conexão se estiver configurado; caso contrário, dispara um erro.
function getPool() {
  if (!pool) {
    throw new Error('Banco de dados não configurado. Informe DATABASE_URL no arquivo .env.');
  }

  return pool;
}

// Executa uma query SQL usando o pool de conexões.
async function query(text, params = []) {
  const databasePool = getPool();
  return databasePool.query(text, params);
}

// Encerra o pool de conexões quando a aplicação é finalizada.
async function closePool() {
  if (pool) {
    await pool.end();
  }
}

module.exports = {
  query,
  getPool,
  closePool,
  isDatabaseConfigured: Boolean(pool)
};