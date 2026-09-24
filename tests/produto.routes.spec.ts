import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/config/database';
import { Produto } from '../src/models/produto.model';
import produtoService from '../src/services/produto.service';

describe('Rotas de Produto (Integração HTTP / E2E CRUD)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Produto.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('GET / - deve retornar status 200 e mensagem de boas vindas', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.mensagem).toBeDefined();
  });

  describe('POST /produtos', () => {
    it('deve criar um novo produto e retornar 201', async () => {
      const payload = {
        nome: 'Teclado Mecânico',
        preco: 250,
        descricao: 'Switches azuis',
      };

      const res = await request(app).post('/produtos').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.nome).toBe(payload.nome);
      expect(res.body.preco).toBe(payload.preco);
      expect(res.body.descricao).toBe(payload.descricao);
    });

    it('deve retornar status 400 se o corpo for inválido', async () => {
      const res = await request(app).post('/produtos').send({
        nome: '',
        preco: -10,
      });

      expect(res.status).toBe(400);
      expect(res.body.mensagem).toBeDefined();
    });
  });

  describe('GET /produtos', () => {
    it('deve retornar lista com produtos cadastrados', async () => {
      await produtoService.criar({ nome: 'Item 1', preco: 15 });
      await produtoService.criar({ nome: 'Item 2', preco: 30 });

      const res = await request(app).get('/produtos');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
    });

    it('deve tratar erro 500 caso o serviço falhe', async () => {
      jest.spyOn(produtoService, 'listar').mockRejectedValueOnce(new Error('Erro de banco de dados'));

      const res = await request(app).get('/produtos');
      expect(res.status).toBe(500);
      expect(res.body.mensagem).toBe('Erro de banco de dados');
    });

    it('deve tratar erro 500 com mensagem padrão quando o erro não possuir message', async () => {
      jest.spyOn(produtoService, 'listar').mockRejectedValueOnce({});

      const res = await request(app).get('/produtos');
      expect(res.status).toBe(500);
      expect(res.body.mensagem).toBe('Erro interno do servidor');
    });
  });

  describe('GET /produtos/promocoes', () => {
    it('deve retornar apenas produtos em promoção (< 100)', async () => {
      await produtoService.criar({ nome: 'Mouse', preco: 45 });
      await produtoService.criar({ nome: 'Monitor', preco: 1200 });

      const res = await request(app).get('/produtos/promocoes');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].nome).toBe('Mouse');
    });

    it('deve tratar erro 500 caso o serviço falhe na busca de promoções', async () => {
      jest.spyOn(produtoService, 'listarPromocoes').mockRejectedValueOnce(new Error('Falha no banco'));

      const res = await request(app).get('/produtos/promocoes');
      expect(res.status).toBe(500);
      expect(res.body.mensagem).toBe('Falha no banco');
    });

    it('deve tratar erro 500 com mensagem padrão em promocoes quando o erro não possuir message', async () => {
      jest.spyOn(produtoService, 'listarPromocoes').mockRejectedValueOnce({});

      const res = await request(app).get('/produtos/promocoes');
      expect(res.status).toBe(500);
      expect(res.body.mensagem).toBe('Erro interno do servidor');
    });
  });

  describe('GET /produtos/:id', () => {
    it('deve retornar 200 e o produto quando encontrado', async () => {
      const criado = await produtoService.criar({ nome: 'Câmera', preco: 400 });

      const res = await request(app).get(`/produtos/${criado.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(criado.id);
      expect(res.body.nome).toBe('Câmera');
    });

    it('deve retornar 404 se o produto não for encontrado', async () => {
      const res = await request(app).get('/produtos/9999');

      expect(res.status).toBe(404);
      expect(res.body.mensagem).toBe('Produto não encontrado');
    });

    it('deve retornar 400 se o ID for inválido', async () => {
      const res = await request(app).get('/produtos/invalido');

      expect(res.status).toBe(400);
      expect(res.body.mensagem).toContain('ID inválido');
    });

    it('deve retornar 400 se o ID for menor ou igual a zero', async () => {
      const res = await request(app).get('/produtos/-5');

      expect(res.status).toBe(400);
      expect(res.body.mensagem).toContain('ID inválido');
    });

    it('deve retornar 400 se o serviço lançar erro de validação de ID', async () => {
      jest.spyOn(produtoService, 'buscarPorId').mockRejectedValueOnce(new Error('Erro interno de ID'));

      const res = await request(app).get('/produtos/10');
      expect(res.status).toBe(400);
      expect(res.body.mensagem).toBe('Erro interno de ID');
    });
  });

  describe('PUT /produtos/:id', () => {
    it('deve atualizar o produto com sucesso e retornar 200', async () => {
      const criado = await produtoService.criar({ nome: 'Caixa de Som', preco: 150 });

      const res = await request(app)
        .put(`/produtos/${criado.id}`)
        .send({ nome: 'Caixa de Som Bluetooth', preco: 199.9 });

      expect(res.status).toBe(200);
      expect(res.body.nome).toBe('Caixa de Som Bluetooth');
      expect(res.body.preco).toBe(199.9);
    });

    it('deve retornar 404 ao tentar atualizar produto inexistente', async () => {
      const res = await request(app)
        .put('/produtos/9999')
        .send({ nome: 'Novo Nome' });

      expect(res.status).toBe(404);
      expect(res.body.mensagem).toBe('Produto não encontrado');
    });

    it('deve retornar 400 se o ID for inválido', async () => {
      const res = await request(app)
        .put('/produtos/abc')
        .send({ nome: 'Teste' });

      expect(res.status).toBe(400);
      expect(res.body.mensagem).toContain('ID inválido');
    });

    it('deve retornar 400 se o ID for negativo no PUT', async () => {
      const res = await request(app)
        .put('/produtos/-1')
        .send({ nome: 'Teste' });

      expect(res.status).toBe(400);
      expect(res.body.mensagem).toContain('ID inválido');
    });

    it('deve retornar 400 se os dados de atualização forem inválidos', async () => {
      const criado = await produtoService.criar({ nome: 'Notebook', preco: 3000 });

      const res = await request(app)
        .put(`/produtos/${criado.id}`)
        .send({ preco: -50 });

      expect(res.status).toBe(400);
      expect(res.body.mensagem).toBeDefined();
    });
  });

  describe('DELETE /produtos/:id', () => {
    it('deve remover o produto e retornar 204', async () => {
      const criado = await produtoService.criar({ nome: 'Tablet', preco: 900 });

      const res = await request(app).delete(`/produtos/${criado.id}`);

      expect(res.status).toBe(204);

      const busca = await produtoService.buscarPorId(criado.id);
      expect(busca).toBeNull();
    });

    it('deve retornar 404 ao tentar remover produto inexistente', async () => {
      const res = await request(app).delete('/produtos/9999');

      expect(res.status).toBe(404);
      expect(res.body.mensagem).toBe('Produto não encontrado');
    });

    it('deve retornar 400 se o ID for inválido', async () => {
      const res = await request(app).delete('/produtos/zero');

      expect(res.status).toBe(400);
      expect(res.body.mensagem).toContain('ID inválido');
    });

    it('deve retornar 400 se o ID for negativo no DELETE', async () => {
      const res = await request(app).delete('/produtos/-2');

      expect(res.status).toBe(400);
      expect(res.body.mensagem).toContain('ID inválido');
    });

    it('deve retornar 400 se o serviço lançar erro inesperado', async () => {
      jest.spyOn(produtoService, 'remover').mockRejectedValueOnce(new Error('Erro ao deletar'));

      const res = await request(app).delete('/produtos/10');
      expect(res.status).toBe(400);
      expect(res.body.mensagem).toBe('Erro ao deletar');
    });
  });
});
