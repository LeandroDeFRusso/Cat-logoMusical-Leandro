import artistaModel from "../models/Artista.js";
import discosModel from "../models/Disco.js";

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
    const discosArray = Array.isArray(discos) ? discos : [discos];

    console.log('Dados recebidos:', req.body); // Certifique-se de que 'discos' está presente e é um array

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

export const removerArtista = async (req, res) => {
    const {nome, generoMusical, discos} = req.body;
    const artistaId = req.params.id;

    try {
        await artistaModel.updateArtista({ artistaId, nome, generoMusical, discos });
        req.flash('success_msg', 'Artista deletado com sucesso!');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Erro ao deletar Artista!');
        res.redirect('/');
    }
};
