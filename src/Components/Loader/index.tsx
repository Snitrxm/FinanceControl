import { Spinner } from '@chakra-ui/react'

const Loader = () => {
  return (
    <div className='absolute h-screen w-full bg-gray-200 opacity-40'>
      <div className='flex justify-center h-screen items-center'>
        <Spinner size="xl"></Spinner>
      </div>
    </div>
  );
}

export default Loader;