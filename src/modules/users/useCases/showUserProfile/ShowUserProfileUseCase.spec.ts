import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show user profile', () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
  })

  it('should be able to return an user data', async () => {
    const user = await createUserUseCase.execute({
      name: 'tester',
      email: 'tester@email.com',
      password: '123'
    })

    const result = await showUserProfileUseCase.execute(user.id!);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
  })

  it('should not be able to return an user with non exists', () => {

    expect(async () => {
      await createUserUseCase.execute({
        name: 'tester',
        email: 'tester@email.com',
        password: '123'
      })

      await showUserProfileUseCase.execute('541');
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
