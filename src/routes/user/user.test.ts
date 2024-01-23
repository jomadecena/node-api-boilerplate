import request from 'supertest';
import app from '../../';

describe('Express App', () => {
  it('should create a new user via API', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        username: 'apiuser',
        email: 'apiuser@example.com',
        password: 'apipassword',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('apiuser');
    expect(response.body.email).toBe('apiuser@example.com');
  });

  it('should retrieve all users via API', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });
});
