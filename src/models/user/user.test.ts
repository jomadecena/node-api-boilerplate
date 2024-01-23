import User from '.';
import sequelize from '../../db';
import dayjs from 'dayjs';

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  it('should create a new user', async () => {
    const newUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'testuser@example.com',
      password: 'testpassword',
      created: dayjs().toISOString()
    });

    expect(newUser).toBeDefined();
    expect(newUser.firstName).toBe('John');
    expect(newUser.lastName).toBe('Doe');
    expect(newUser.email).toBe('testuser@example.com');
  });

  it('should retrieve all users', async () => {
    const users = await User.findAll();

    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
  });
});
