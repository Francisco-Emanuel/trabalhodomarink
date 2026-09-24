import path from 'path';
import { getDatabaseStorage } from '../src/config/database';

describe('Database Configuration', () => {
  it('deve retornar :memory: quando o ambiente for test', () => {
    const storage = getDatabaseStorage('test');
    expect(storage).toBe(':memory:');
  });

  it('deve retornar o caminho customizado quando informado dbPath', () => {
    const customPath = './custom.sqlite';
    const storage = getDatabaseStorage('production', customPath);
    expect(storage).toBe(customPath);
  });

  it('deve retornar o caminho padrão database.sqlite quando não for test e não houver dbPath', () => {
    const defaultExpected = path.resolve(__dirname, '../database.sqlite');
    const storage = getDatabaseStorage('development');
    expect(storage).toBe(defaultExpected);
  });
});
