import artistaModel from "../models/Artista.js";
import discosModel from "../models/Disco.js";

export const showAddDiscos = (req, res) => {
    res.render('discos/adicionarDiscos');
};

export const montarDisco = async (req, res) => {
    const { titulo, anoLancamento, nome, duracao, genero } = req.body;
    const capa = req.files?.['capa']?.[0]?.filename || null;
    const audio = req.files?.['audio']?.[0]?.filename || null;

    try {
        const generosArray = Array.isArray(genero) ? genero : [genero];
        await discosModel.createDisco(titulo, anoLancamento, capa, nome, duracao, audio, generosArray);
        req.flash('success_msg', 'Disco cadastrado com sucesso!');
        res.redirect('/');
    } catch (err) {
        console.error('Erro ao salvar o disco:', err);
        req.flash('error_msg', 'Erro ao salvar o disco, tente novamente!');
        res.redirect('/discos/adicionarDiscos');
    }
};

export const showDiscos = async (req, res) => {
    try {
        const discos = await discosModel.findAllDiscos();
        const artistas = await artistaModel.findAllArtista();
        
        for (const disco of discos) {
            disco.generos = await discosModel.findGenerosByDiscoId(disco.discoId);
            disco.faixas = await discosModel.findFaixasByDiscoId(disco.discoId);
        }
        res.render('index', { discos, artistas });
    } catch (err) {
        console.error('Erro ao buscar discos ou artistas:', err);
        req.flash('error_msg', 'Erro ao renderizar página, tente novamente');
        res.redirect('/');
    }
};

export const findDiscoById = async (req, res) => {
    try {
        const discos = await discosModel.findDiscoById(req.params.id);
        if(!discos) {
            req.flash('error_msg', 'Disco não encontrado');
            res.redirect('/');
        }
        res.render('discos/discosDetalhes', { disco: discos });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Erro ao buscar disco por ID, tente novamente!');
        res.redirect('/');  
    }
};

export const showUpdateDiscos = async (req, res) => {
    try {
        const disco = await discosModel.findDiscoById(req.params.id);
        if (!disco) {
            req.flash('error_msg', 'Disco não encontrado!');
            return res.redirect('/');
        }
        res.render('discos/editarDiscos', { disco });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Erro ao carregar informações do disco, tente novamente!');
        res.redirect('/');
    }
};

export const updateDiscoById = async (req, res) => {
    const discoId = req.params.id;
    const { titulo, anoLancamento, genero, faixaNome, faixaDuracao } = req.body;
    const novaCapa = req.files?.capa?.[0]?.filename;
    let capa;
    const novoAudio = req.files?.audio?.[0]?.filename || null;
    let faixaAudio;

    try {
        if (novaCapa) {
            capa = novaCapa; 
        } else {
            const discoAtual = await discosModel.findDiscoById(discoId);
            capa = discoAtual.capa;
        }
        if (novoAudio) {
            faixaAudio = novoAudio;
        } else {
            const discoAtual = await discosModel.findDiscoById(discoId);
            faixaAudio = discoAtual.faixaAudio;
        }
        await discosModel.updateDiscoById(
            discoId,
            titulo,
            anoLancamento,
            capa,
            genero,
            faixaNome,
            faixaDuracao,
            faixaAudio
        );
        req.flash('success_msg', 'Disco atualizado com sucesso!');
        res.redirect(`/discos/${discoId}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Erro ao atualizar o disco, tente novamente!');
        res.redirect(`/discos/editarDiscos/${discoId}`);
    }
};

export const excluirDisco = async (req, res) => {
    try {
        await discosModel.deleteDisco(req.params.id);
        req.flash('success_msg', 'Disco excluído com sucesso!');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Erro ao excluir disco, tente novamente!');
        res.redirect('/');
    }
};

export const buscarDisco = async (req, res) => {
    const { titulo, artista, genero, generoMusical } = req.query;

    try {
        const discos = await discosModel.searchDisco({ titulo, artista, genero, generoMusical });
        for (const disco of discos) {
            disco.generos = await discosModel.findGenerosByDiscoId(disco.discoId);
            disco.faixas = await discosModel.findFaixasByDiscoId(disco.discoId);
        }
        const artistas = await artistaModel.searchArtista({ titulo, artista, genero, generoMusical });
        res.render('index', { 
            discos, 
            artistas,
            filtros: req.query,
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Erro ao buscar dados, tente novamente.');
        res.redirect('/');
    }
};

