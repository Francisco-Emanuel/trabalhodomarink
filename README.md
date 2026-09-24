# Projeto de Produtos - API RESTful em TypeScript

Projeto refatorado para **TypeScript** atendendo integralmente a todos os requisitos do professor:
- ✅ **Interface**: Definição e uso de interfaces TypeScript no modelo, DTOs e contratos de serviço (`IProduto`, `IProdutoCreateDTO`, `IProdutoUpdateDTO`, `IProdutoService`).
- ✅ **Sequelize**: Utilização do ORM Sequelize para mapeamento objeto-relacional com tipagem estrita no TypeScript.
- ✅ **Banco de Dados Relacional**: SQLite integrado via Sequelize (`database.sqlite` em execução padrão e banco em memória `:memory:` para testes isolados).
- ✅ **CRUD Completo Funcional**: Operações completas de Criação, Leitura (todos e por ID), Atualização e Exclusão com códigos HTTP semânticos (200, 201, 204, 400, 404, 500), além de consulta de promoções.
- ✅ **Testes com Jest e Cobertura > 90%**: Cobertura atingida de **100%** em declarações, branches, funções e linhas.

---

## 📁 Estrutura do Projeto

```
trabalhodomarink/
├── src/
│   ├── config/
│   │   └── database.ts            # Configuração da conexão com SQLite via Sequelize
│   ├── interfaces/
│   │   └── produto.interface.ts   # Interfaces TypeScript para entidades, DTOs e serviços
│   ├── models/
│   │   └── produto.model.ts       # Modelo Sequelize tipado com TypeScript
│   ├── services/
│   │   └── produto.service.ts     # Lógica de negócio e implementação da interface de CRUD
│   ├── controllers/
│   │   └── produto.controller.ts  # Controladores HTTP Express com validações e status codes
│   ├── routes/
│   │   └── produto.routes.ts      # Rotas REST da aplicação
│   ├── app.ts                     # Configuração e middlewares da aplicação Express
│   └── server.ts                  # Inicialização do servidor e sincronização do banco
├── tests/
│   ├── database.spec.ts           # Testes unitários da configuração do banco
│   ├── produto.model.spec.ts      # Testes unitários do modelo e regras de negócio
│   ├── produto.service.spec.ts    # Testes unitários do serviço (CRUD completo)
│   └── produto.routes.spec.ts     # Testes de integração E2E com Supertest
├── jest.config.js                 # Configuração do Jest e metas de cobertura
├── tsconfig.json                  # Configuração do compilador TypeScript
└── package.json                   # Dependências e scripts npm
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- npm

### 1. Instalar as dependências
```bash
npm install
```

### 2. Executar em modo de desenvolvimento
Executa com recarga automática usando `tsx`:
```bash
npm run dev
```
O servidor estará acessível em `http://localhost:3000`.

### 3. Compilar e executar em produção
```bash
npm run build
npm start
```

---

## 🧪 Como Executar os Testes e Verificar a Cobertura

Para rodar todos os testes unitários e de integração:
```bash
npm test
```

Para gerar o relatório detalhado de cobertura de testes:
```bash
npm run test:coverage
```

### 📊 Relatório de Cobertura Obtido

```
=============================== Coverage summary ===============================
Statements   : 100% ( 123/123 )
Branches     : 100% ( 67/67 )
Functions    : 100% ( 22/22 )
Lines        : 100% ( 116/116 )
================================================================================
Test Suites: 4 passed, 4 total
Tests:       49 passed, 49 total
```

---

## 📋 Endpoints da API (CRUD de Produtos)

| Método | Rota | Descrição | Status Sucesso |
|---|---|---|---|
| `GET` | `/` | Status da API | `200 OK` |
| `GET` | `/produtos` | Lista todos os produtos | `200 OK` |
| `GET` | `/produtos/promocoes` | Lista produtos em promoção (`preco < 100`) | `200 OK` |
| `GET` | `/produtos/:id` | Busca produto específico por ID | `200 OK` |
| `POST` | `/produtos` | Cadastra novo produto | `201 Created` |
| `PUT` | `/produtos/:id` | Atualiza produto existente | `200 OK` |
| `DELETE` | `/produtos/:id` | Remove produto existente | `204 No Content` |

### Exemplos de Requisição

#### Criar Produto (`POST /produtos`):
```json
{
  "nome": "Teclado Mecânico RGB",
  "preco": 199.90,
  "descricao": "Switch Blue"
}
```

#### Atualizar Produto (`PUT /produtos/1`):
```json
{
  "preco": 179.90
}
```
