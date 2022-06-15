interface ILocalStorageRepository{
  set(key: string, data: any): Promise<void>,
  delete(...data: any): Promise<void>
}

const LocalStorageRepository: ILocalStorageRepository = {
  set: async (key: string, data: any): Promise<void> => {
    return localStorage.setItem(key, data);
  },
  delete: async (...data: any): Promise<void> => {
    data.map((item: string) => {
      return localStorage.removeItem(item);
    })
  }
}

export default LocalStorageRepository