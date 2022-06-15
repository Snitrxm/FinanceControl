import { collection, doc, onSnapshot, query, updateDoc, where } from '@firebase/firestore';
import { db } from '../firebaseConfig';

interface IRequest {
  newSalary: string,
}

export class NewSalaryService {

  public async execute(data: IRequest): Promise<any> {
    const name = localStorage.getItem("name");
    const usersCollection = collection(db, 'users');
    const q = await query(usersCollection, where('name', '==', name));
    onSnapshot(q, async (snapshot) => {
      if(snapshot.docs.length === 0){
        console.log("Nenhum usario encontrado");
      }else{
        snapshot.docs.map(async () => {
          const userDoc = doc(db, "users", name as any);
          await updateDoc(userDoc, {salary: 5000})
        })
      }
    })
  }
}