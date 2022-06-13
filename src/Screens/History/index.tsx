import { ArrowBackIcon } from '@chakra-ui/icons';
import { collection, onSnapshot, query, where } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';


const HistoryScreen = () => {
  const historyCollection = collection(db, 'transactions');
  const [history, setHistory] = useState<any>([]);
  const name = localStorage.getItem("name");
  
  useEffect(() => {
    const getHistory = () => {
      const q = query(historyCollection, where('user', '==', name));
      onSnapshot(q, (snapshot) => {
        if(snapshot.docs.length === 0){
          console.log("Nenhum historico desse user")
        }else{
          setHistory(snapshot.docs.map((doc) => doc.data()));
        }
      })
    }
    getHistory();
  },[])

  history.reverse();

  return (
    <div className="">
      <nav className="m-5">
        <a href="/index">
          <ArrowBackIcon className='text-xl'></ArrowBackIcon>
        </a>
      </nav>

      {history.length === 0 ? (
        <>
          <h1 className='text-center text-2xl'>No History!</h1>
          <p className='text-center'>Make any transaction</p>
        </>
      ) : (
        <></>
      )}

      {history.map((item: any) => (
      <div className="flex flex-col items-center gap-5 mt-5">
        {item.type === "WON" ? (
        <div className="border border-green-500 flex flex-col items-center gap-4 w-4/5">
          <div>
            <h1 className="text-xl font-bold mt-2">{item.type}</h1>
          </div>
          <div className="text-center">
            <h1><span className="font-bold">Reason:</span> {item.typeWork}</h1>
            <h2><span className="font-bold">Money:</span> U$ {item.money}</h2>
          </div>
        </div>
        ) : (
        <div className="border border-red-500 flex flex-col items-center gap-4 w-4/5">
          <div>
            <h1 className="text-xl font-bold mt-2">{item.type}</h1>
          </div>
          <div className="text-center">
            <h1><span className="font-bold">Reason:</span> {item.typeWork}</h1>
            <h2><span className="font-bold">Money:</span> U$ {item.money}</h2>
          </div>
        </div>
        )}
        
      </div>
      ))}
    </div>
    
  );
}

export default HistoryScreen