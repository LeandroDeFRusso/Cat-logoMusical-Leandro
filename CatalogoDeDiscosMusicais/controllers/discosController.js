import discosModel from "../models/Disco.js";

export const showAddDiscos = (req, res) => {
    res.render('discos/adicionarDiscos');
};

export const montarDisco = async (req, res) => {
    const { titulo, anoLancamento, nome, duracao, genero } = req.body;
    const capa = req.files['capa'] ? req.files['capa'][0].filename : null;
    const audio = req.files['audio'] ? req.files['audio'][0].filename : null;

    try {
        await discosModel.createDisco(titulo, anoLancamento, capa, nome, duracao, audio, genero);
        req.flash('success_msg', 'Disco cadastrado com sucesso!');
        res.redirect('/');
    } catch (err) {
        req.flash('error_msg', 'Erro ao salvar o disco!');
        res.redirect('/discos/adicionarDiscos');
    }
};

