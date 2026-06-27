require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const database = require('../config/database');

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Configure DATABASE_URL no arquivo .env antes de executar o schema.');
    process.exit(1);
  }

  try {
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');

    await database.query(schema);
    console.log('Schema aplicado com sucesso.');
  } catch (error) {
    console.error('Erro ao aplicar schema:', error.message);
    process.exitCode = 1;
  } finally {
    await database.closePool();
  }
}

main();
