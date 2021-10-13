import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get balance', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory,
      statementsRepositoryInMemory)
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory,
      usersRepositoryInMemory)
  })

  it('should be able to get a balance for user', async () => {
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

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.WITHDRAW,
      amount: 10,
      description: 'withdraw test'
    })

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.WITHDRAW,
      amount: 5,
      description: 'withdraw test'
    })

    const result = await getBalanceUseCase.execute({user_id: user.id!});

    expect(result.balance).toEqual(35);
    expect(result.statement.length).toBe(3);
  })

  it('should be able to get a balance for user', () => {
    expect( async () => {
      await getBalanceUseCase.execute({user_id: '123'});
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})
