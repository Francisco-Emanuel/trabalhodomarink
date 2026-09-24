import sequelize from '../src/config/database';
import { Produto } from '../src/models/produto.model';

describe('Produto Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve instanciar um produto e verificar o método estaEmPromocao() corretamente', () => {
    const produtoCaro = Produto.build({
      nome: 'Teclado Mecânico',
      preco: 250,
      descricao: 'Teclado RGB',
    });

    const produtoBarato = Produto.build({
      nome: 'Mousepad',
      preco: 49.9,
      descricao: 'Mousepad gamer',
    });

    expect(produtoCaro.estaEmPromocao()).toBe(false);
    expect(produtoBarato.estaEmPromocao()).toBe(true);
  });
});
