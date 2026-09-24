import { Sequelize } from 'sequelize';
import path from 'path';

export function getDatabaseStorage(nodeEnv?: string, dbPath?: string): string {
  if (nodeEnv === 'test') {
    return ':memory:';
  }
  return dbPath || path.resolve(__dirname, '../../database.sqlite');
}

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: getDatabaseStorage(process.env.NODE_ENV, process.env.DB_PATH),
  logging: false,
});

export default sequelize;
