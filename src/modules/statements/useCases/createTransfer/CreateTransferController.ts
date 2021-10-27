import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";



class CreateTransferController {
 async handle(request: Request, response: Response): Promise<Response> {
  const senderId = request.user.id;
  const { user_id } = request.params;
  const { amount, description } = request.body;

  const createTransferUseCase = container.resolve(CreateTransferUseCase);

  const statement = await createTransferUseCase.execute({
    sender_id: senderId,
    user_id,
    amount,
    description
  })

  return response.json(statement);
 }
}

export { CreateTransferController }
