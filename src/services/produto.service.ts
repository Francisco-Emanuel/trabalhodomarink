import { Produto } from '../models/produto.model';
import {
  IProdutoCreateDTO,
  IProdutoUpdateDTO,
  IProdutoService,
} from '../interfaces/produto.interface';

export class ProdutoService implements IProdutoService {
  async criar(dados: IProdutoCreateDTO): Promise<Produto> {
    if (!dados || !dados.nome || typeof dados.nome !== 'string' || dados.nome.trim() === '') {
      throw new Error('O campo "nome" é obrigatório e não pode ser vazio');
    }

    if (dados.preco == null || typeof dados.preco !== 'number' || isNaN(dados.preco) || dados.preco <= 0) {
      throw new Error('O campo "preco" é obrigatório e deve ser um número maior que zero');
    }

    const produto = await Produto.create({
      nome: dados.nome.trim(),
      preco: dados.preco,
      descricao: dados.descricao ? dados.descricao.trim() : undefined,
    });

    return produto;
  }

  async listar(): Promise<Produto[]> {
    return await Produto.findAll();
  }

  async buscarPorId(id: number): Promise<Produto | null> {
    if (!id || typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('ID inválido. Deve ser um número inteiro positivo');
    }

    return await Produto.findByPk(id);
  }

  async atualizar(id: number, dados: IProdutoUpdateDTO): Promise<Produto | null> {
    const produto = await this.buscarPorId(id);
    if (!produto) {
      return null;
    }

    if (dados.nome !== undefined) {
      if (typeof dados.nome !== 'string' || dados.nome.trim() === '') {
        throw new Error('O campo "nome" não pode ser vazio');
      }
      produto.nome = dados.nome.trim();
    }

    if (dados.preco !== undefined) {
      if (typeof dados.preco !== 'number' || isNaN(dados.preco) || dados.preco <= 0) {
        throw new Error('O campo "preco" deve ser um número maior que zero');
      }
      produto.preco = dados.preco;
    }

    if (dados.descricao !== undefined) {
      produto.descricao = dados.descricao ? dados.descricao.trim() : undefined;
    }

    await produto.save();
    return produto;
  }

  async remover(id: number): Promise<boolean> {
    const produto = await this.buscarPorId(id);
    if (!produto) {
      return false;
    }

    await produto.destroy();
    return true;
  }

  async listarPromocoes(): Promise<Produto[]> {
    const todos = await this.listar();
    return todos.filter((p) => p.estaEmPromocao());
  }
}

export default new ProdutoService();
