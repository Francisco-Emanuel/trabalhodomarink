import express, { Application, Request, Response } from 'express';
import produtoRoutes from './routes/produto.routes';

const app: Application = express();

app.use(express.json());

// Rotas da API
app.use('/produtos', produtoRoutes);

// Rota raiz para status
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    mensagem: 'API de Produtos rodando com TypeScript, Sequelize e SQLite',
  });
});

export default app;
