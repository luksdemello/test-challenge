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

  it('should be able to show an user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'testeGet',
      email: 'testeget@email.com',
      password: '123'
    })

    const user = await request(app).post('/api/v1/sessions').send({
      email: 'testeget@email.com',
      password: '123'
    })

    const { token } = user.body;

    const result = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`,
    })

    expect(result.status).toBe(200);
  })
})
