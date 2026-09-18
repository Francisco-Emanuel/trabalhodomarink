const service = require("../services/produto.service");

exports.listar = (req, res) => {
    res.status(200).json(service.listar());
};

exports.buscarPorId = (req, res) => {
    const produto = service.buscarPorId(req.params.id);

    if (!produto) {
        return res.status(404).json({
            mensagem: "Produto não encontrado"
        });
    }

    res.status(200).json(produto);
};

exports.criar = (req, res) => {
    try {
        const produto = service.criar(req.body);
        res.status(201).json(produto);
    } catch (erro) {
        res.status(400).json({
            mensagem: erro.message
        });
    }
};
