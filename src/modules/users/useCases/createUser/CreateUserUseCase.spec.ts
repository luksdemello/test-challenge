import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from './CreateUserUseCase';

let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;

describe('Create user', () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Usuário tester',
      email: 'teste@email.com',
      password: '123'
    })

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
  })

  it('should not be able to create an user with name exists', () => {

    expect( async () => {
      await createUserUseCase.execute({
        name: 'Usuário tester',
        email: 'teste@email.com',
        password: '123'
      })

      await createUserUseCase.execute({
        name: 'Usuário tester',
        email: 'teste@email.com',
        password: '123'
      })
    }).rejects.toBeInstanceOf(CreateUserError);

  })
})
