const express = require('express');
const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

router.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'cadastro.html'));
});

router.post('/cadastro', async (req, res) => {
    const { nome, email, senha, confirmar_senha } = req.body;

    if (!nome || !email || !senha || !confirmar_senha) {
        return res.redirect('/cadastro?mensagem=Todos os campos são obrigatórios.&tipo=erro');
    }
    if (senha !== confirmar_senha) {
        return res.redirect('/cadastro?mensagem=As senhas não coincidem.&tipo=erro');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.redirect('/cadastro?mensagem=E-mail inválido.&tipo=erro');
    }

    try {
        const usuarioExistente = await User.findByEmail(email);
        if (usuarioExistente) {
            return res.redirect('/cadastro?mensagem=E-mail já registrado.&tipo=erro');
        }

        await User.create({ nome, email, senha });
        res.redirect('/login?mensagem=Cadastro realizado com sucesso!&tipo=sucesso');
    } catch (error) {
        res.redirect(`/cadastro?mensagem=Erro ao cadastrar: ${error.message}&tipo=erro`);
    }
});

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.redirect('/login?mensagem=E-mail e senha são obrigatórios.&tipo=erro');
    }

    try {
        const usuario = await User.findByEmail(email);
        if (!usuario) {
            return res.redirect('/login?mensagem=E-mail ou senha inválidos.&tipo=erro');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.redirect('/login?mensagem=E-mail ou senha inválidos.&tipo=erro');
        }

        req.session.usuario = {
            id: usuario.idUsuario,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.idTipoUsuario
        };

        res.redirect('/cal');
    } catch (error) {
        res.redirect(`/login?mensagem=Erro ao fazer login: ${error.message}&tipo=erro`);
    }
});

module.exports = router;
