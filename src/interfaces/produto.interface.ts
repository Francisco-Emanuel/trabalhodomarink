/**
 * Interfaces TypeScript para a entidade Produto e suas operações.
 * Atende ao requisito do professor: Interface TypeScript.
 */

export interface IProduto {
  id?: number;
  nome: string;
  preco: number;
  descricao?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProdutoCreateDTO {
  nome: string;
  preco: number;
  descricao?: string;
}

export interface IProdutoUpdateDTO {
  nome?: string;
  preco?: number;
  descricao?: string;
}

export interface IProdutoService {
  criar(dados: IProdutoCreateDTO): Promise<IProduto>;
  listar(): Promise<IProduto[]>;
  buscarPorId(id: number): Promise<IProduto | null>;
  atualizar(id: number, dados: IProdutoUpdateDTO): Promise<IProduto | null>;
  remover(id: number): Promise<boolean>;
}
