import { Button, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { errorFillPaymentDayInput } from '../../../ErrorMessages';
import LocalStorageRepository from '../../../Repositories/LocalstorageRepository';
import { useNavigate } from 'react-router-dom';

const QuestionDay = () => {
  const [paymentDay, setPaymentDay] = useState('');
  const paymentDayStorage = localStorage.getItem('paymentDay');
  const navigation = useNavigate();

  useEffect((): void => {
    if (paymentDayStorage) {
      navigation('/index');
    }
  },[])

  const finishQuestions = async () => {
    const paymentDayInt = parseInt(paymentDay);

    if(paymentDay && paymentDayInt > 0 && paymentDayInt < 31){
      await LocalStorageRepository.set('paymentDay', paymentDay);
      navigation('/index');
    }else{
      errorFillPaymentDayInput();
    }
  } 

  return (
    <>
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center border rounded-md p-5 flex flex-col gap-10">
          <h1 className="font-bold text-2xl">What's the day of<br/> your payment?</h1>
          <Input placeholder="12" onChange={day => setPaymentDay(day.target.value)} value={paymentDay}></Input>
          <Button colorScheme="purple" onClick={finishQuestions}>Next Question</Button> 
        </div>
      </div>
    </>
  )
}

export default QuestionDay;