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
        for (const disco of discos) {
            disco.generos = await discosModel.findGenerosByDiscoId(disco.discoId);
            disco.faixas = await discosModel.findFaixasByDiscoId(disco.discoId);
        }
        res.render('index', { discos });
    } catch (err) {
        console.error('Erro ao buscar discos:', err);
        req.flash('error_msg', 'Erro ao renderizar página, tente novamente"');
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
    const { discoId, novoTitulo, novoAnoLancamento, novaCapa, novoGenero, nome, duracao, audio } = req.body;
    try {
        const novoDisco = await discosModel.updateDiscoById(
            discoId,
            novoTitulo,
            novoAnoLancamento,
            novaCapa,
            novoGenero,
            nome,
            duracao,
            audio
        );
        req.flash('success_msg', 'Disco atualizado com sucesso!');
        res.redirect(`/discos/${discoId}`);
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Erro ao atualizar o disco, tente novamente!');
        res.redirect(`/discos/editarDiscos/${req.body.discoId}`);
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
    const { titulo, artista, genero } = req.query;
    try {
        const discos = await discosModel.findDisco({ titulo, artista, genero });
        res.render('index', { 
            discos, 
            filtros: req.query
        });
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Erro ao buscar discos, tente novamente.');
        res.redirect('/');
    }
};

