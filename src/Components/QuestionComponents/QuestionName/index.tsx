import { Button, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const handleNextQuestion = () => {
    if(name){
      localStorage.setItem("name", name);
      window.location.reload();
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