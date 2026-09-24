import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import sequelize from './config/database';
import { Produto } from './models/produto.model';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    // Sincroniza os modelos com o banco SQLite
    await sequelize.sync();
    console.log('✅ Banco de dados SQLite sincronizado com sucesso.');

    // Opcional: Se a tabela estiver vazia, popula com os dados iniciais
    const count = await Produto.count();
    if (count === 0) {
      await Produto.bulkCreate([
        { nome: 'Notebook', preco: 3500, descricao: 'Notebook para desenvolvimento' },
        { nome: 'Mouse', preco: 80, descricao: 'Mouse óptico USB (em promoção)' },
      ]);
      console.log('📦 Dados iniciais inseridos com sucesso.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📋 Rotas disponíveis:`);
      console.log(`   GET    http://localhost:${PORT}/produtos`);
      console.log(`   GET    http://localhost:${PORT}/produtos/promocoes`);
      console.log(`   GET    http://localhost:${PORT}/produtos/:id`);
      console.log(`   POST   http://localhost:${PORT}/produtos`);
      console.log(`   PUT    http://localhost:${PORT}/produtos/:id`);
      console.log(`   DELETE http://localhost:${PORT}/produtos/:id`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar o servidor:', error);
    process.exit(1);
  }
}

bootstrap();
