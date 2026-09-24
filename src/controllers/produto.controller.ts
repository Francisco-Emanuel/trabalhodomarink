import { Request, Response } from 'express';
import produtoService from '../services/produto.service';

export class ProdutoController {
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const produtos = await produtoService.listar();
      res.status(200).json(produtos);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message || 'Erro interno do servidor' });
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        res.status(400).json({ mensagem: 'ID inválido. Deve ser um número inteiro positivo' });
        return;
      }

      const produto = await produtoService.buscarPorId(id);
      if (!produto) {
        res.status(404).json({ mensagem: 'Produto não encontrado' });
        return;
      }

      res.status(200).json(produto);
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, preco, descricao } = req.body;
      const produto = await produtoService.criar({ nome, preco, descricao });
      res.status(201).json(produto);
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        res.status(400).json({ mensagem: 'ID inválido. Deve ser um número inteiro positivo' });
        return;
      }

      const produtoAtualizado = await produtoService.atualizar(id, req.body);
      if (!produtoAtualizado) {
        res.status(404).json({ mensagem: 'Produto não encontrado' });
        return;
      }

      res.status(200).json(produtoAtualizado);
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  async remover(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        res.status(400).json({ mensagem: 'ID inválido. Deve ser um número inteiro positivo' });
        return;
      }

      const removido = await produtoService.remover(id);
      if (!removido) {
        res.status(404).json({ mensagem: 'Produto não encontrado' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  async listarPromocoes(req: Request, res: Response): Promise<void> {
    try {
      const promocoes = await produtoService.listarPromocoes();
      res.status(200).json(promocoes);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message || 'Erro interno do servidor' });
    }
  }
}

export default new ProdutoController();
