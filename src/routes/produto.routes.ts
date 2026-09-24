import { Router } from 'express';
import produtoController from '../controllers/produto.controller';

const router = Router();

// Rotas CRUD
router.get('/', (req, res) => produtoController.listar(req, res));
router.get('/promocoes', (req, res) => produtoController.listarPromocoes(req, res));
router.get('/:id', (req, res) => produtoController.buscarPorId(req, res));
router.post('/', (req, res) => produtoController.criar(req, res));
router.put('/:id', (req, res) => produtoController.atualizar(req, res));
router.delete('/:id', (req, res) => produtoController.remover(req, res));

export default router;
