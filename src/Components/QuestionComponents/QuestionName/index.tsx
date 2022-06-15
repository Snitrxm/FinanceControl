import { Button, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserRepository from '../../../Repositories/UserRepository';
import LocalStorageRepository from '../../../Repositories/LocalstorageRepository';
import { alreadyExistNameError } from '../../../ErrorMessages';
import { errorFillNameInput } from '../../../ErrorMessages';


const QuestionName = () => {
  const [name, setName ] = useState('');
  
  const handleNextQuestion = async () => {
    if(name){
      const response = await UserRepository.checkIfUserExists(name);
      if(response.data === true){
        alreadyExistNameError();
      }else{
        await LocalStorageRepository.set("name", name);
        window.location.reload();
      }
    }else{
      errorFillNameInput();
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