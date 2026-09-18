class Produto {
    constructor({ id, nome, preco }) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    estaEmPromocao() {
        return this.preco < 100;
    }
}

Produto.produtos = [
    new Produto({
        id: 1,
        nome: "Notebook",
        preco: 3500
    }),
    new Produto({
        id: 2,
        nome: "Mouse",
        preco: 120
    })
];

module.exports = Produto;
