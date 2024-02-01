import User from '.';
import dayjs from 'dayjs';

const INITIAL_USER = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@email.com',
  password: 'password1',
  created: dayjs().toISOString()
}

const USER_LIST = [
  {
    ...INITIAL_USER
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@email.com',
    password: 'password2',
    created: dayjs().toISOString()

  }
]

jest.mock('.', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

describe('User Model', () => {
  beforeAll(async () => {
    // await sequelize.sync();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {

    (User.create as jest.Mock).mockResolvedValueOnce(INITIAL_USER as User);

    const newUser = await User.create(INITIAL_USER);

    expect(newUser).toBeDefined();
    expect(newUser.firstName).toBe(INITIAL_USER.firstName);
    expect(newUser.lastName).toBe(INITIAL_USER.lastName);
    expect(newUser.email).toBe(INITIAL_USER.email);
  });

  it('should retrieve all users', async () => {

    (User.findAll as jest.Mock).mockResolvedValueOnce(USER_LIST as User[]);

    const users = await User.findAll();

    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
  });
});
