import { Button, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const QuestionSalary = () => {
  const [salary, setSalary] = useState<string>('');
  const name = localStorage.getItem("name");
  const errorMessage = () => {
    toast.error('Please enter your salary', {
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
    if(salary){
      localStorage.setItem("salary", salary);
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
          <h1 className="font-bold text-2xl">Okay { name }, <br/>What's your salary?</h1>
          <Input placeholder='U$ 1200' type="number" onChange={salary => setSalary(salary.target.value)} value={salary}></Input>
          <Button colorScheme="whatsapp" onClick={handleNextQuestion}>Next Question</Button>
        </div>
      </div>
    </>
    
  );
}

export default QuestionSalary;