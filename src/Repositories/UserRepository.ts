import Api from "../Services/Api";

interface IUserRepository {
  checkIfUserExists(name: string): Promise<any>
  getUser(name: string): Promise<any>
  createUser(name: string, salary: number, type: string, paymentDay: string): Promise<any>
  deleteUser(_id: string): Promise<any>
  syncMoney(_id:string, money: number): Promise<any>
  syncMoneySpending(_id: string, moneySpending: number): Promise<any>
  changeSalary(_id: string, salary: number): Promise<any>
  resetBalance(_id: string): Promise<any>
  getPayment(_id: string, total: number): Promise<any>
}

const UserRepository: IUserRepository = {
  checkIfUserExists: (name: string): Promise<boolean> => Api.post('/user/checkifexists', { name }),
  getUser: (name: string): Promise<any> => Api.post('/user/getuser', { name }),
  createUser: (name: string, salary: number, type: string, paymentDay: string): Promise<any> => Api.post('/user/createuser', { name, salary, type, paymentDay }),
  deleteUser: (_id: string): Promise<any> => Api.delete('/user/deleteuser', { data: { _id } }),
  syncMoney: (_id: string, money:number): Promise<any> => Api.post('/user/syncmoney', { _id, money }),
  syncMoneySpending: (_id: string, moneySpending:number): Promise<any> => Api.post('/user/syncmoneyspending', { _id, moneySpending }),
  changeSalary: (_id: string, salary: number): Promise<any> => Api.put('/user/changesalary', { _id, salary }),
  resetBalance: (_id: string): Promise<any> => Api.put('/user/resetbalance', { _id }),
  getPayment: (_id: string, total: number) => Api.put('/user/getpayment', { _id, total}),
}

export default UserRepository;