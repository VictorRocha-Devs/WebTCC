const express = require('express');
const path = require('path');
const Evento = require('../models/evento');

const router = express.Router();

// Middleware de autenticação
function isAuthenticated(req, res, next) {
    if (req.session.usuario) {
        return next();
    }
    res.redirect('/login');
}

router.get('/cal', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'cal.html'));
});

router.get('/info', isAuthenticated, async (req, res) => {
    const { data } = req.query;

    if (!data) {
        return res.redirect('/cal?mensagem=Data não fornecida.&tipo=erro');
    }

    try {
        await Evento.findByDate(data);
        res.sendFile(path.join(__dirname, '../public', 'info.html'));
    } catch (error) {
        res.redirect(`/cal?mensagem=Erro ao carregar eventos: ${error.message}&tipo=erro`);
    }
});

router.get('/api/eventos', async (req, res) => {
    const { data } = req.query;
    if (!data) {
        return res.status(400).json({ error: 'Data não fornecida.' });
    }

    try {
        const eventos = await Evento.findByDate(data);
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar eventos.' });
    }
});

module.exports = router;
