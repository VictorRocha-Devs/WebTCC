const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const eventosRoutes = require('./routes/eventos');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use('/', authRoutes);
app.use('/', eventosRoutes);

// Fallback
app.use((req, res) => {
    res.status(404).redirect('/login?mensagem=Página não encontrada.&tipo=erro');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
