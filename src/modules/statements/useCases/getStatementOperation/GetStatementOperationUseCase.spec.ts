import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";




let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get statement operation', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory,
      statementsRepositoryInMemory)
      getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory,
        statementsRepositoryInMemory)
  })

  it('should be able to get a statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Tester Lucas',
      email: 'email@tester.com',
      password: 'meupassword'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'depsoit test'
    })

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!
    })

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('user_id');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('description');
    expect(result).toBeInstanceOf(Statement);
  })


  it('should not be able to get a statement with non exists user ', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Tester Lucas',
        email: 'email@tester.com',
        password: 'meupassword'
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.DEPOSIT,
        amount: 50,
        description: 'depsoit test'
      })

      await getStatementOperationUseCase.execute({
        user_id: '2345678',
        statement_id: statement.id!
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to get a statement with non exists user ', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Tester Lucas',
        email: 'email@tester.com',
        password: 'meupassword'
      });


      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: '123'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

})
