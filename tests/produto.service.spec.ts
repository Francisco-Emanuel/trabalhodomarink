import sequelize from '../src/config/database';
import produtoService from '../src/services/produto.service';
import { Produto } from '../src/models/produto.model';

describe('ProdutoService (CRUD e regras de negócio)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Produto.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('criar()', () => {
    it('deve criar um produto com sucesso quando os dados forem válidos', async () => {
      const dados = {
        nome: 'Monitor UltraWide',
        preco: 1299.9,
        descricao: 'Monitor LG 29 polegadas',
      };

      const produto = await produtoService.criar(dados);

      expect(produto).toBeDefined();
      expect(produto.id).toBeDefined();
      expect(produto.nome).toBe(dados.nome);
      expect(produto.preco).toBe(dados.preco);
      expect(produto.descricao).toBe(dados.descricao);
    });

    it('deve criar um produto com sucesso sem descrição (campo opcional)', async () => {
      const dados = {
        nome: 'Cabo HDMI',
        preco: 25.0,
      };

      const produto = await produtoService.criar(dados);

      expect(produto.id).toBeDefined();
      expect(produto.nome).toBe('Cabo HDMI');
      expect(produto.preco).toBe(25.0);
      expect(produto.descricao).toBeUndefined();
    });

    it('deve criar um produto com descrição vazia convertida para undefined', async () => {
      const dados = {
        nome: 'Mousepad Simples',
        preco: 15.0,
        descricao: '',
      };

      const produto = await produtoService.criar(dados);

      expect(produto.id).toBeDefined();
      expect(produto.descricao).toBeUndefined();
    });

    it('deve lançar erro se os dados forem nulos ou vazios', async () => {
      await expect(produtoService.criar(null as any)).rejects.toThrow(
        'O campo "nome" é obrigatório e não pode ser vazio'
      );
    });

    it('deve lançar erro se o nome não for fornecido ou for apenas espaços', async () => {
      await expect(
        produtoService.criar({ nome: '', preco: 100 })
      ).rejects.toThrow('O campo "nome" é obrigatório e não pode ser vazio');

      await expect(
        produtoService.criar({ nome: '   ', preco: 100 })
      ).rejects.toThrow('O campo "nome" é obrigatório e não pode ser vazio');

      await expect(
        produtoService.criar({ nome: 123 as any, preco: 100 })
      ).rejects.toThrow('O campo "nome" é obrigatório e não pode ser vazio');
    });

    it('deve lançar erro se o preco for inválido, nulo ou menor/igual a zero', async () => {
      await expect(
        produtoService.criar({ nome: 'Item Teste', preco: null as any })
      ).rejects.toThrow('O campo "preco" é obrigatório e deve ser um número maior que zero');

      await expect(
        produtoService.criar({ nome: 'Item Teste', preco: 0 })
      ).rejects.toThrow('O campo "preco" é obrigatório e deve ser um número maior que zero');

      await expect(
        produtoService.criar({ nome: 'Item Teste', preco: -10 })
      ).rejects.toThrow('O campo "preco" é obrigatório e deve ser um número maior que zero');

      await expect(
        produtoService.criar({ nome: 'Item Teste', preco: 'cem' as any })
      ).rejects.toThrow('O campo "preco" é obrigatório e deve ser um número maior que zero');
    });
  });

  describe('listar()', () => {
    it('deve retornar um array vazio se não houver produtos cadastrados', async () => {
      const lista = await produtoService.listar();
      expect(lista).toEqual([]);
    });

    it('deve retornar todos os produtos cadastrados', async () => {
      await produtoService.criar({ nome: 'Item 1', preco: 10 });
      await produtoService.criar({ nome: 'Item 2', preco: 20 });

      const lista = await produtoService.listar();
      expect(lista).toHaveLength(2);
      expect(lista[0].nome).toBe('Item 1');
      expect(lista[1].nome).toBe('Item 2');
    });
  });

  describe('buscarPorId()', () => {
    it('deve lançar erro se o id for inválido (menor ou igual a 0 ou não numérico)', async () => {
      await expect(produtoService.buscarPorId(0)).rejects.toThrow('ID inválido');
      await expect(produtoService.buscarPorId(-5)).rejects.toThrow('ID inválido');
      await expect(produtoService.buscarPorId(NaN)).rejects.toThrow('ID inválido');
      await expect(produtoService.buscarPorId(null as any)).rejects.toThrow('ID inválido');
    });

    it('deve retornar o produto quando o id existir', async () => {
      const criado = await produtoService.criar({ nome: 'Mouse', preco: 80 });
      const encontrado = await produtoService.buscarPorId(criado.id);

      expect(encontrado).not.toBeNull();
      expect(encontrado?.id).toBe(criado.id);
      expect(encontrado?.nome).toBe('Mouse');
    });

    it('deve retornar null quando o id não for encontrado', async () => {
      const encontrado = await produtoService.buscarPorId(9999);
      expect(encontrado).toBeNull();
    });
  });

  describe('atualizar()', () => {
    it('deve atualizar nome, preco e descricao com sucesso', async () => {
      const criado = await produtoService.criar({
        nome: 'Headset Básico',
        preco: 90,
        descricao: 'Sem microfone',
      });

      const atualizado = await produtoService.atualizar(criado.id, {
        nome: 'Headset Gamer Pro',
        preco: 180,
        descricao: 'Com microfone 7.1',
      });

      expect(atualizado).not.toBeNull();
      expect(atualizado?.nome).toBe('Headset Gamer Pro');
      expect(atualizado?.preco).toBe(180);
      expect(atualizado?.descricao).toBe('Com microfone 7.1');
    });

    it('deve atualizar apenas os campos informados', async () => {
      const criado = await produtoService.criar({
        nome: 'Webcam',
        preco: 150,
        descricao: 'HD 720p',
      });

      const atualizado = await produtoService.atualizar(criado.id, {
        preco: 130,
      });

      expect(atualizado?.nome).toBe('Webcam');
      expect(atualizado?.preco).toBe(130);
      expect(atualizado?.descricao).toBe('HD 720p');
    });

    it('deve atualizar descricao para undefined quando informada string vazia', async () => {
      const criado = await produtoService.criar({
        nome: 'Webcam 4k',
        preco: 500,
        descricao: 'Top de linha',
      });

      const atualizado = await produtoService.atualizar(criado.id, {
        descricao: '',
      });

      expect(atualizado?.descricao).toBeUndefined();
    });

    it('deve retornar null se o produto para atualizar não existir', async () => {
      const atualizado = await produtoService.atualizar(9999, { nome: 'Não existe' });
      expect(atualizado).toBeNull();
    });

    it('deve lançar erro se o novo nome for vazio', async () => {
      const criado = await produtoService.criar({ nome: 'Teclado', preco: 100 });

      await expect(
        produtoService.atualizar(criado.id, { nome: '' })
      ).rejects.toThrow('O campo "nome" não pode ser vazio');

      await expect(
        produtoService.atualizar(criado.id, { nome: 123 as any })
      ).rejects.toThrow('O campo "nome" não pode ser vazio');
    });

    it('deve lançar erro se o novo preço for menor ou igual a zero', async () => {
      const criado = await produtoService.criar({ nome: 'Teclado', preco: 100 });

      await expect(
        produtoService.atualizar(criado.id, { preco: 0 })
      ).rejects.toThrow('O campo "preco" deve ser um número maior que zero');

      await expect(
        produtoService.atualizar(criado.id, { preco: -50 })
      ).rejects.toThrow('O campo "preco" deve ser um número maior que zero');

      await expect(
        produtoService.atualizar(criado.id, { preco: 'grátis' as any })
      ).rejects.toThrow('O campo "preco" deve ser um número maior que zero');
    });
  });

  describe('remover()', () => {
    it('deve remover o produto existente e retornar true', async () => {
      const criado = await produtoService.criar({ nome: 'Pen Drive', preco: 30 });
      const removido = await produtoService.remover(criado.id);

      expect(removido).toBe(true);

      const busca = await produtoService.buscarPorId(criado.id);
      expect(busca).toBeNull();
    });

    it('deve retornar false quando tentar remover produto inexistente', async () => {
      const removido = await produtoService.remover(9999);
      expect(removido).toBe(false);
    });

    it('deve lançar erro ao tentar remover com id inválido', async () => {
      await expect(produtoService.remover(-1)).rejects.toThrow('ID inválido');
    });
  });

  describe('listarPromocoes()', () => {
    it('deve retornar apenas produtos que custam menos de 100', async () => {
      await produtoService.criar({ nome: 'Mouse Barato', preco: 50 });
      await produtoService.criar({ nome: 'Cabo USB', preco: 20 });
      await produtoService.criar({ nome: 'Placa de Vídeo', preco: 2500 });
      await produtoService.criar({ nome: 'Headset Caro', preco: 100 });

      const promocoes = await produtoService.listarPromocoes();

      expect(promocoes).toHaveLength(2);
      expect(promocoes.map((p) => p.nome)).toEqual(['Mouse Barato', 'Cabo USB']);
    });
  });
});
