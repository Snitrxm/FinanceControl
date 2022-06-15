import {
  Button, Icon, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure
} from '@chakra-ui/react';
import { addDoc, collection } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { BsGear } from 'react-icons/bs';
import { ToastContainer } from 'react-toastify';
import { errorMessageDeposit, errorMessageWithdraw } from '../../ErrorMessages';
import { db } from '../../firebaseConfig';
import UserRepository from '../../Repositories/UserRepository';

const MainScreen = () => {
  const { isOpen: openDepositModal, onOpen: onOpenDepositModal, onClose: closeDepositModal } = useDisclosure();
  const { isOpen: openWithdrawModal, onOpen: onOpenWithdrawModal, onClose: closeWithdrawModal } = useDisclosure();

  const name = localStorage.getItem("name")
  const salary = localStorage.getItem("salary")
  const salaryInt = parseInt(salary as any)
  const type = localStorage.getItem("type")
  const money: any = localStorage.getItem("money");
  const paymentDay = localStorage.getItem("paymentDay")
  const paymentDayInt = parseInt(paymentDay as any)

  const [deposit, setDeposit] = useState<string>('');
  const [depositType, setDepositType] = useState<string>('');
  const [withdraw, setWithdraw] = useState<string>('');
  const [withdrawType, setWithdrawType] = useState<string>('');
  const historyCollection = collection(db, 'transactions');
  
  useEffect(() => {
    const fetchData = async () => {
      const userExist = await UserRepository.checkIfUserExists(name as string);
      if(userExist.data === true){
        console.log("Already in database!");
      }else{
        await UserRepository.createUser(name as string ,salaryInt as number, type as string, paymentDay as string);
      }
    }
    fetchData();
  },[])


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

  const addSalary = () => {
    const salaryInt = parseInt(salary as any)
    const moneyInt = parseInt(money as any)
    const total = moneyInt + salaryInt
    localStorage.setItem("money", JSON.stringify(total));
    window.location.reload();
  }

  const handleDeposit = async () => {
    if(deposit){
      const moneyInt = parseInt(money as any)
      const depositInt = parseInt(deposit as any)
      const total = moneyInt + depositInt
      localStorage.setItem("money", JSON.stringify(total));
      await addDoc(historyCollection, {money: depositInt, type: "WON", typeWork: depositType, user: name})
      window.location.reload();
    }else{
      errorMessageDeposit();
    }
  }

  const handleWithdraw = async () => {
    if(withdraw){
      const moneyInt = parseInt(money as any)
      const withdrawInt = parseInt(withdraw as any)
      const total = moneyInt - withdrawInt;
      localStorage.setItem("money", JSON.stringify(total));
      await addDoc(historyCollection, {money: withdrawInt, type: "LOSS", typeWork: withdrawType, user: name})
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
          <ModalHeader>How Much you won?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="U$ 100" onChange={deposit => setDeposit(deposit.target.value)} value={deposit}></Input>
          </ModalBody>
          <ModalHeader>Reason</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Freelance" onChange={depositType => setDepositType(depositType.target.value)} value={depositType}></Input>
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
          <ModalHeader>How Much you loss?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="U$ 100" onChange={withdraw => setWithdraw(withdraw.target.value)} value={withdraw}></Input>
          </ModalBody>
          <ModalHeader>Reason</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Supermarket" onChange={withdrawType => setWithdrawType(withdrawType.target.value)} value={withdrawType}></Input>
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
          <button className='border rounded-md border-green-500 px-10 py-5 text-xl w-48 hover:bg-green-500 transition-colors hover:text-white' onClick={onOpenDepositModal}>Won</button>
          <button className='border rounded-md border-red-500 px-10 py-5 text-xl w-48 hover:bg-red-500 transition-colors hover:text-white' onClick={onOpenWithdrawModal}>Loss</button>
          <button className='border rounded-md border-blue-500 px-10 py-5 text-xl w-48 hover:bg-blue-500 transition-colors hover:text-white' onClick={addSalary}>Add Salary</button>
          <a href="/history"><button className='border p-2 rounded-md'>See History</button></a>
          <a href="/config">
            <Icon as={BsGear} className="text-2xl"></Icon>
          </a>
        </div>
      </div>
    </>
    
  );
}

export default MainScreen;