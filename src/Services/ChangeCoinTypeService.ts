import LocalStorageRepository from "../Repositories/LocalstorageRepository";

export const ChangeCoinTypeService = {
  execute: async (coin: string): Promise<any> => {
    if(coin === "R$"){
      await LocalStorageRepository.set("coinType", coin);
      return true;
    }else if(coin === "U$"){
      await LocalStorageRepository.set("coinType", coin);
      return true;
    }else{
      console.log("Invalid Coin Type!");
    }
  }
}