import { Button, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuestionDay = () => {
  const [paymentDay, setPaymentDay] = useState('');

  const errorMessage = () => {
    toast.error('Please enter a date', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const finishQuestions = () => {
    if(paymentDay){
      localStorage.setItem("paymentDay", paymentDay);
      window.location.href = '/index';
    }else{
      errorMessage();
    }
  } 

  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center border rounded-md p-5 flex flex-col gap-10">
          <h1 className="font-bold text-2xl">What's the day of<br/> your payment?</h1>
          <Input onChange={day => setPaymentDay(day.target.value)} value={paymentDay}></Input>
          <Button colorScheme="whatsapp" onClick={finishQuestions}>Next Question</Button> 
        </div>
      </div>
    </>
    
  )

}

export default QuestionDay;