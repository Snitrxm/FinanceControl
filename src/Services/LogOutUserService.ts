import LocalStorageRepository from "../Repositories/LocalstorageRepository";

const LogOutUserService = {
  execute: async () => {
    await LocalStorageRepository.delete("name", "salary", "type", "paymentDay");
  }
}

export default LogOutUserService