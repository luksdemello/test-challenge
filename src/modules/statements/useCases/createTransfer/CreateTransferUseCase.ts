import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { CreateTransferDTO } from "./CreateTransferDTO";


@injectable()
class CreateTransferUseCase {
constructor(
  @inject('UsersRepository')
  private usersRepository: IUsersRepository,

  @inject('StatementsRepository')
  private statementsRepository: IStatementsRepository
) {}

async execute({ sender_id, amount, description, user_id }: CreateTransferDTO): Promise<Statement> {
  const send_user = await this.usersRepository.findById(sender_id);
  const receive_user = await this.usersRepository.findById(user_id);

  if(!send_user || !receive_user) {
    throw new CreateStatementError.UserNotFound();
  }

  const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

  if (balance < amount) {
    throw new CreateStatementError.InsufficientFunds()
  }

  const statement = await this.statementsRepository.create({
    amount,
    description,
    type: OperationType.TRANSFER,
    user_id,
    sender_id
  })

  return statement
  }
}

export { CreateTransferUseCase }
