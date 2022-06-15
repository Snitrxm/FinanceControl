export class ConvertToIntService {
  constructor(){
    //
  }

  public async execute(value: string): Promise<number> {
    return parseInt(value, 10);
  }
}
