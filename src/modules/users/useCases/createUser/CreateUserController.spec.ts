import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;

describe('Create user controller', () => {


  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

  });

  afterAll( async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to create a new user', async () => {
    const result = await request(app).post('/api/v1/users').send({
      name: 'teste',
      email: 'teste@email.com',
      password: 'tester'
    })

    expect(result.status).toBe(201)
  })
})
