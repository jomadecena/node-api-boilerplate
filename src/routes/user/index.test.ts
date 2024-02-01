import request from 'supertest';
import app from '../../app';
import * as dbTest from '../../db/mock';
const { mockedSequelizedSync } = dbTest;

describe('Express App', () => {
  beforeAll(() => {
    mockedSequelizedSync();
  })
  
  it('should create a new user via API', async () => {
    const response = await request(app)
      .post('/api/user')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        email: 'apiuser@example.com',
        password: 'apipassword',
      });
    expect(response.status).toBe(201);
  });
});
