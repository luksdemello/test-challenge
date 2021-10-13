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

  it('should be able to login with an user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'testAuthenticate',
      email: 'testAuthenticate@hotmail.com',
      password: 'minhasenha'
    })

    const result = await request(app).post('/api/v1/sessions').send({
      email: 'testAuthenticate@hotmail.com',
      password: 'minhasenha'
    })

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty('token');
    expect(result.body).toHaveProperty('user');

  })
})
