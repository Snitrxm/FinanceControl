import LocalStorageRepository from "../Repositories/LocalstorageRepository";

interface IRequest {
  name: string,
  salary: string,
  type: string,
  paymentDay: string
}

const LoginUserService = {
  execute: async (data: IRequest) => {
    await LocalStorageRepository.set("name", data.name);
    await LocalStorageRepository.set("salary", data.salary);
    await LocalStorageRepository.set("type", data.type);
    await LocalStorageRepository.set("paymentDay", data.paymentDay);
  }
}

export default LoginUserService;