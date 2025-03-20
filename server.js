require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const helmet = require('helmet');
const csrf = require('csurf');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

// Conecta no banco de dados
mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit('ready');
    console.log('Conectado ao MongoDB');
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(helmet()); // Helmet deve vir antes de tudo para segurança

// configuração da session
const sessionOptions = session({
  secret: 'testing123',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // Sessão dura 30 dias
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

//CSRF após a sessão
app.use(csrf());

// Middlewares globais
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

// Rotas
app.use(routes);

// Configuração do template engine
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Inicia o servidor após conectar ao MongoDB
app.on('ready', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
});