import { Button, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, collection, getDocs } from '@firebase/firestore';
import { db } from '../../../firebaseConfig';

const QuestionName = () => {
  const [name, setName ] = useState('');
  const errorMessage = () => {
    toast.error('Please enter your name', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const alreadyExistNameError = () => {
    toast.error('Name already taken', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const usersCollection = collection(db, 'users');  
  const handleNextQuestion = async () => {
    if(name){
      const users = await getDocs(usersCollection);
      const data = users.docs.map((user) => ({...user.data()}));
      if(data && data.length === 0){
        localStorage.setItem("name", name);
        window.location.reload();
      }
      data.map(async (user) => {
        if(user.name == name){
          alreadyExistNameError();
        }else{
          localStorage.setItem("name", name);
          window.location.reload();
        }
      })
    }else{
      errorMessage();
    }
  }

  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center border rounded-md p-5 flex flex-col gap-10">
          <h1 className="font-bold text-2xl">What's your name?</h1> 
          <Input placeholder='Andre' onChange={name => setName(name.target.value)} value={name}></Input>
          <Button colorScheme="whatsapp" onClick={handleNextQuestion}>Next Question</Button>
        </div>
      </div>
    </>
    
  )

}

export default QuestionName;