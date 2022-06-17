import Api from "../Services/Api";

interface ITransactionRepository {
  deposit(money: number, type: string, reason: string, _id: string): Promise<any>
  getAllByUser(_id: string): Promise<any>
  deleteAllTransactionByUser(_id: string): Promise<any>
}

const TransactionRepository: ITransactionRepository = {
  deposit: (money: number, type: string, reason: string, _id: string) => Api.post('/transaction/deposit', { money, type, reason, _id }),
  getAllByUser: (_id: string) => Api.post('/transaction/getallbyuser', { _id }),
  deleteAllTransactionByUser: (_id: string) => Api.delete('/transaction/deletealltransactionbyuser', { data: { _id } }),
}

export default TransactionRepository;