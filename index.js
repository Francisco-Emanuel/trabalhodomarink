const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const produtos = require('./produtos.json');

app.get('/produtos', (req, res) => {
  res.status(200).json(produtos);
});

app.get('/produtos/:id', (req, res) => {
  const idBusca = parseInt(req.params.id);
  
  const produto = produtos.find(p => p.id === idBusca);

  if (!produto) {
    return res.status(404).json({ mensagem: 'Produto não encontrado' });
  }

  res.status(200).json(produto);
});

app.post('/produtos', (req, res) => {
  const produto = { id: produtos.length + 1, ...req.body };
  produtos.push(produto);
  res.status(201).json(produto);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
