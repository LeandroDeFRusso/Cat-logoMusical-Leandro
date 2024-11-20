import discosModel from "../models/Disco.js";
import artistaModel from "../models/Artista.js";

export const showAddArtista = async (req, res) => {
    try {
        const discos = await discosModel.validarDiscosNaoAssociados();
        res.render('artistas/adicionarArtistas', { discos });
    } catch (err) {
        console.error('Erro ao carregar discos:', err);
        res.status(500).send('Erro ao carregar formulário');
    }
};

export const montarArtista = async (req, res) => {
    const { nome, generoMusical, discos } = req.body;
    console.log(req.body);
    try {
        await artistaModel.createArtista({ nome, generoMusical, discos });

        req.flash('success_msg', 'Artista cadastrado com sucesso!');
        res.redirect('/');
    } catch (err) {
        console.error('Erro ao salvar artista na controller:', err);
        req.flash('error_msg', 'Erro ao salvar artista!');
        res.redirect('/artistas/adicionarArtistas');
    }
};