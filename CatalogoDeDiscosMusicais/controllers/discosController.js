import discosModel from "../models/Disco.js";

export const showAddDiscos = (req, res) => {
    res.render('discos/adicionarDiscos');
};

export const montarDisco = async (req, res) => {
    console.log('Arquivos recebidos:', req.files);
    console.log('Dados recebidos:', req.body);

    const { titulo, anoLancamento, nome, duracao, genero } = req.body;
    const capa = req.files?.['capa']?.[0]?.filename || null;
    const audio = req.files?.['audio']?.[0]?.filename || null;

    try {
        await discosModel.createDisco(titulo, anoLancamento, capa, nome, duracao, audio, genero);
        req.flash('success_msg', 'Disco cadastrado com sucesso!');
        res.redirect('/');
    } catch (err) {
        console.error('Erro ao salvar o disco:', err);
        req.flash('error_msg', 'Erro ao salvar o disco!');
        res.redirect('/discos/adicionarDiscos');
    }
};

export const showDiscos = async (req, res) => {
    try {
        const discos = await discosModel.findAllDiscos();
        console.log(discos)
        res.render('index', { discos });
    } catch (err) {
        console.error('Erro ao buscar discos:', err);
        res.status(500).send('Erro ao carregar discos');
    }
};

export const findDiscoById = async (req, res) => {
    try {
        const discos = await discosModel.findDiscoById(req.params.id);
        console.log(discos);
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

export const editarDiscos = async (req, res) => {
    try {
        const disco = await discosModel.findDiscoById(req.params.id);

        if (!disco) {
            req.flash('error_msg', 'Disco não encontrado!');
            return res.redirect('/');
        }

        res.render('discos/editarDiscos', { disco });
    } catch (err) {
        console.error('Erro ao carregar disco para edição:', err);
        req.flash('error_msg', 'Erro ao carregar informações do disco.');
        res.redirect('/');
    }
};

export const updateDiscoById = async (req, res) => {
    const { discoId, titulo, anoLancamento, capa, genero, Nome, duracao, audio } = req.body;

    try {
        const novoDisco = await discosModel.updateDiscoById(
            discoId,
            titulo,
            anoLancamento,
            capa,
            genero,
            Nome,
            duracao,
            audio
        );
        console.log('Disco atualizado:', novoDisco);
        req.flash('success_msg', 'Disco atualizado com sucesso!');
        res.redirect(`/discos/${discoId}`);
    } catch (err) {
        console.error('Erro ao atualizar disco na controller:', err);
        req.flash('error_msg', 'Erro ao atualizar o disco, tente novamente!');
        res.redirect(`/discos/editar/${req.body.discoId}`);
    }
};
