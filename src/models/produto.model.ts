import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IProduto } from '../interfaces/produto.interface';

export interface ProdutoCreationAttributes extends Optional<IProduto, 'id' | 'createdAt' | 'updatedAt'> {}

export class Produto extends Model<IProduto, ProdutoCreationAttributes> implements IProduto {
  declare id: number;
  declare nome: string;
  declare preco: number;
  declare descricao?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Método de negócio herdado do projeto original:
   * Verifica se o produto custa menos de R$ 100.
   */
  public estaEmPromocao(): boolean {
    return this.preco < 100;
  }
}

Produto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'produtos',
    timestamps: true,
  }
);

export default Produto;
