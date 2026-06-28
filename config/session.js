// Configura a sessao do Express para login administrativo e flash messages.
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const database = require('./database');

const isProduction = process.env.NODE_ENV === 'production';

const sessionOptions = {
  name: 'manvielle.sid',
  secret: process.env.SESSION_SECRET || 'troque-este-segredo-em-producao',
  resave: false,
  saveUninitialized: false,
  proxy: isProduction,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction ? 'auto' : false,
    maxAge: 1000 * 60 * 60 * 2
  }
};

if (database.isDatabaseConfigured) {
  sessionOptions.store = new pgSession({
    pool: database.getPool(),
    tableName: 'session',
    createTableIfMissing: true
  });
}

module.exports = session(sessionOptions);
