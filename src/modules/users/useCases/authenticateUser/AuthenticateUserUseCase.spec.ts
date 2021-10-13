import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase

describe('Authenticate user', () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to start a session', async () => {
    const user = {
      name: 'tester',
      email: 'tester@email.com',
      password: '123'
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty('token');
  })

  it('should not be able to start a session with a non exists user',  () => {
   expect( async () => {
    const user = {
      name: 'tester',
      email: 'tester@email.com',
      password: '123'
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    const result = await authenticateUserUseCase.execute({
      email: 'outro@email.com',
      password: user.password
    })
   }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)


  });

  it('should not be able to start a session with a wrong passowrd',  () => {
    expect( async () => {
     const user = {
       name: 'tester',
       email: 'tester@email.com',
       password: '123'
     }

     await createUserUseCase.execute({
       name: user.name,
       email: user.email,
       password: user.password
     })

     const result = await authenticateUserUseCase.execute({
       email: user.email,
       password: '321'
     })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)


   })

})
