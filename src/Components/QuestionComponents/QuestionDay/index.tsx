import { Button, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorFillPaymentDayInput } from '../../../ErrorMessages';
import LocalStorageRepository from '../../../Repositories/LocalstorageRepository';

const QuestionDay = () => {
  const [paymentDay, setPaymentDay] = useState('');
  const paymentDayStorage = localStorage.getItem('paymentDay');

  useEffect((): any => {
    if (paymentDayStorage) {
      return window.location.href = '/index';
    }
  },[])

  const finishQuestions = async () => {
    if(paymentDay){
      await LocalStorageRepository.set('paymentDay', paymentDay);
      return window.location.href = '/index';
    }else{
      errorFillPaymentDayInput();
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