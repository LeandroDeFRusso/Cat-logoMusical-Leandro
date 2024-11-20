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
    try {
        const generos = Array.isArray(generoMusical) ? generoMusical : [generoMusical];
        const discosSelecionados = Array.isArray(discos) ? discos : [discos];

        console.log(generos, discosSelecionados);

        await artistaModel.createArtista({ nome, generos, discos: discosSelecionados });

        req.flash('success_msg', 'Artista cadastrado com sucesso!');
        res.redirect('/artistas/visualizarArtistas');
    } catch (err) {
        console.error('Erro ao salvar artista na controller:', err);
        req.flash('error_msg', 'Erro ao salvar artista!');
        res.redirect('/artistas/adicionarArtistas');
    }
};


export const listarArtistas = async (req, res) => {
    try {
        const artistas = await artistaModel.findAllArtistas();

        const artistasAgrupados = artistas.reduce((acc, item) => {
            const artistaExistente = acc.find(a => a.artistaId === item.artistaId);

            if (artistaExistente) {
                artistaExistente.discos.push({
                    discoId: item.discoId,
                    tituloDisco: item.tituloDisco,
                    anoLancamento: item.anoLancamento,
                    capa: item.capa,
                });
            } else {
                acc.push({
                    artistaId: item.artistaId,
                    nomeArtista: item.nomeArtista,
                    generoMusical: item.generoMusical,
                    discos: item.discoId
                        ? [{
                              discoId: item.discoId,
                              tituloDisco: item.tituloDisco,
                              anoLancamento: item.anoLancamento,
                              capa: item.capa,
                          }]
                        : [],
                });
            }

            return acc;
        }, []);

        res.render('artistas/listarArtistas', { artistas: artistasAgrupados });
    } catch (err) {
        console.error('Erro ao listar artistas:', err);
        req.flash('error_msg', 'Erro ao carregar lista de artistas.');
        res.redirect('/');
    }
};

export const renderEditarArtista = async (req, res) => {
    try {
        const artista = await artistaModel.findArtistaById(req.params.id);

        if (!artista) {
            req.flash('error_msg', 'Artista não encontrado!');
            return res.redirect('/artistas/visualizarArtistas');
        }

        res.render('artistas/editarArtistas', { artista });
    } catch (err) {
        console.error('Erro ao carregar artista para edição:', err);
        req.flash('error_msg', 'Erro ao carregar informações do artista.');
        res.redirect('/artistas/visualizarArtistas');
    }
};

export const atualizarArtista = async (req, res) => {
    const { nome, generoMusical } = req.body;

    try {
        await artistaModel.updateArtista(req.params.id, nome, generoMusical);
        req.flash('success_msg', 'Artista atualizado com sucesso!');
        res.redirect('/artistas/visualizarArtistas');
    } catch (err) {
        console.error('Erro ao atualizar artista:', err);
        req.flash('error_msg', 'Erro ao atualizar artista.');
        res.redirect(`/artistas/editarArtistas/${req.params.id}`);
    }
};


export const excluirArtista = async (req, res) => {
    try {
        await artistaModel.deleteArtista(req.params.id);
        req.flash('success_msg', 'Artista excluído com sucesso!');
        res.redirect('/artistas/visualizarArtistas');
    } catch (err) {
        console.error('Erro ao excluir artista:', err);
        req.flash('error_msg', 'Erro ao excluir artista.');
        res.redirect('/artistas/visualizarArtistas');
    }
};

