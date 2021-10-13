import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe('Create statement', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory,
    statementsRepositoryInMemory)
  })

  it('should be able to create a new deposit statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Tester Lucas',
      email: 'email@tester.com',
      password: 'meupassword'
    });

    const result = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'depsoit test'
    })

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('user_id');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('description');
    expect(result.type).toEqual('deposit');
  })

  it('should be able to create a new withdraw statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Tester Lucas',
      email: 'email@tester.com',
      password: 'meupassword'
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'depsoit test'
    })

    const result = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.WITHDRAW,
      amount: 10,
      description: 'withdraw test'
    })

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('user_id');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('description');
    expect(result.type).toEqual('withdraw');
  })

  it('should not be able to create a new statement with non exists user', () => {

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: '123',
        type: OperationType.DEPOSIT,
        amount: 50,
        description: 'depsoit test'
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })

  it('should not be able to create a new withdraw statement without balance', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Tester Lucas',
        email: 'email@tester.com',
        password: 'meupassword'
      });

      await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.DEPOSIT,
        amount: 50,
        description: 'depsoit test'
      })

      const result = await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.WITHDRAW,
        amount: 60,
        description: 'withdraw test'
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
