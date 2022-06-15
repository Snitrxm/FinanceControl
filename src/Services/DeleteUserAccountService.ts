import { collection, onSnapshot, doc, query, where, deleteDoc } from '@firebase/firestore';
import { db } from '../firebaseConfig';

export class DeleteUserAccountService {
  
  public async execute(): Promise<any> {
    const name = localStorage.getItem("name");
    const usersCollection = collection(db, 'users');

    const q = query(usersCollection, where('name', '==', name));
    onSnapshot(q, async (snapshot) => {
      if(snapshot.docs.length === 0){
        console.log("Nenhum usario encontrado");
      }else{
        snapshot.docs.map(async (doc) => {
          localStorage.setItem("userId", doc.id);
        })
      }
    })
    const userId = localStorage.getItem("userId");
    console.log(userId);
    const userDoc = doc(db, "users", userId as string);
    await deleteDoc(userDoc);  
  }
}