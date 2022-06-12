import { Button } from '@chakra-ui/react'

const QuestionStart = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="text-center border rounded-md p-5 flex flex-col gap-10">
        <h1 className="font-bold text-2xl">To get started<br/>Let's ask a few questions.</h1>
        <Button colorScheme="whatsapp">Get Started</Button>
      </div>
    </div>
  );
}

export default QuestionStart;