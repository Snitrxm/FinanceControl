import { Button } from '@chakra-ui/react';
import LocalStorageRepository from '../../../Repositories/LocalstorageRepository';

const QuestionType = () => {
  const handleEconomizer = async () => {
    await LocalStorageRepository.set("type", "economizer");
    window.location.reload();
  }

  const handleModerate = async () => {
    await LocalStorageRepository.set("type", "moderate");
    window.location.reload();
  }

  const handleSpender = async () => {
    await LocalStorageRepository.set("type", "spender");
    window.location.reload();
  }

  return (
    <>
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center border rounded-md p-5 flex flex-col gap-10">
          <h1 className="font-bold text-2xl">Now select,<br/> what type of consumer <br/>you are</h1>
          <div className='flex flex-col gap-5'>
            <Button colorScheme="whatsapp" onClick={handleEconomizer}>Economizer</Button>
            <Button colorScheme="twitter" onClick={handleModerate}>Moderate</Button>
            <Button colorScheme="red" onClick={handleSpender}>Spender</Button>
          </div>
        </div>
      </div>
    </>
    
  );
}

export default QuestionType;