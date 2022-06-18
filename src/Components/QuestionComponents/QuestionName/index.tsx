import { Button, Input } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import UserRepository from '../../../Repositories/UserRepository';
import LocalStorageRepository from '../../../Repositories/LocalstorageRepository';
import { alreadyExistNameError } from '../../../ErrorMessages';
import { errorFillNameInput } from '../../../ErrorMessages';


const QuestionName = () => {
  const [name, setName ] = useState('');

  useEffect(() => {
    const name = localStorage.getItem("name");
    const salary = localStorage.getItem("salary");
    const type = localStorage.getItem("type");
    const paymentDay = localStorage.getItem("paymentDay");
    const money = localStorage.getItem("money");

    const deleteLocalStorage = async () => {
      if(name || salary || type || paymentDay || money) {
        await LocalStorageRepository.delete("name", "salary", "type", "paymentDay", "money");
        console.log("Deleted from localStorage!")
      }
    }
    deleteLocalStorage();
  },[])
  
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
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center border rounded-md p-5 flex flex-col gap-10">
          <h1 className="font-bold text-2xl">What's your name?</h1> 
          <Input placeholder='Andre' onChange={name => setName(name.target.value)} value={name}></Input>
          <Button colorScheme="purple" onClick={handleNextQuestion}>Next Question</Button>
          <p>Already have a account? <a href="/login" className='underline'>Log In</a></p>
        </div>
      </div>
    </> 
  )
}

export default QuestionName;