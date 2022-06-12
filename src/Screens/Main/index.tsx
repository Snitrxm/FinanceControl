import { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input
} from '@chakra-ui/react'
import { toast, ToastContainer } from 'react-toastify';


const MainScreen = () => {
  const { isOpen: openDepositModal, onOpen: onOpenDepositModal, onClose: closeDepositModal } = useDisclosure();
  const { isOpen: openWithdrawModal, onOpen: onOpenWithdrawModal, onClose: closeWithdrawModal } = useDisclosure();

  const name = localStorage.getItem("name")
  const salary = localStorage.getItem("salary")
  const type = localStorage.getItem("type")
  const money: any = localStorage.getItem("money");
  const paymentDay = localStorage.getItem("paymentDay")

  const [deposit, setDeposit] = useState<string>('');
  const [withdraw, setWithdraw] = useState<string>('');

  useEffect(() => {
    if(money){
      
    }else{
      localStorage.setItem("money", JSON.stringify(0));
    }
  }, [money])
  
  useEffect(() => {
    if(name && salary && type && paymentDay){
      
    }else{
      window.location.href = '/'
    }
  },[name, salary, type, paymentDay])

  const errorMessageDeposit = () => {
    toast.error('Please enter a value in deposit input', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const errorMessageWithdraw = () => {
    toast.error('Please enter a value in withdraw input', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const addSalary = () => {
    const salaryInt = parseInt(salary as any)
    const moneyInt = parseInt(money as any)
    const total = moneyInt + salaryInt
    localStorage.setItem("money", JSON.stringify(total));
    window.location.reload();
  }

  const handleDeposit = () => {
    if(deposit){
      const moneyInt = parseInt(money as any)
      const depositInt = parseInt(deposit as any)
      const total = moneyInt + depositInt
      localStorage.setItem("money", JSON.stringify(total));
      window.location.reload();
    }else{
      errorMessageDeposit();
    }
  }

  const handleWithdraw = () => {
    if(withdraw){
      const moneyInt = parseInt(money as any)
      const withdrawInt = parseInt(withdraw as any)
      const total = moneyInt - withdrawInt;
      localStorage.setItem("money", JSON.stringify(total));
      window.location.reload();
    }else{
      errorMessageWithdraw();
    }
  }

  return (
    <>
    <ToastContainer></ToastContainer>
    <Modal isOpen={openDepositModal} onClose={closeDepositModal} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How Much you want to deposit?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeContent="U$ 100" onChange={deposit => setDeposit(deposit.target.value)} value={deposit}></Input>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='whatsapp' mr={3} onClick={() => {
              closeDepositModal();
              handleDeposit();
            }}>
              Deposit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={openWithdrawModal} onClose={closeWithdrawModal} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How Much you want to withdraw?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeContent="U$ 100" onChange={withdraw => setWithdraw(withdraw.target.value)} value={withdraw}></Input>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => {
              closeWithdrawModal();
              handleWithdraw();
            }}>
              Withdraw
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div>
        <nav className='bg-green-500 h-24 flex justify-center items-center'>
          <h1 className='text-white text-2xl font-bold'>I Have { money } U$</h1>
        </nav>
        <div className='flex flex-col items-center mt-10 gap-8'>
          <button className='border border-green-500 px-10 py-5 text-xl w-48 hover:bg-green-500 transition-colors hover:text-white' onClick={onOpenDepositModal}>Deposit</button>
          <button className='border border-red-500 px-10 py-5 text-xl w-48 hover:bg-red-500 transition-colors hover:text-white' onClick={onOpenWithdrawModal}>Withdraw</button>
          <button className='border border-blue-500 px-10 py-5 text-xl w-48 hover:bg-blue-500 transition-colors hover:text-white' onClick={addSalary}>Add Salary</button>
        </div>
      </div>
    </>
    
  );
}

export default MainScreen;