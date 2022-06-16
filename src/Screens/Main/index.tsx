import {
  Button, Icon, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { errorMessageDeposit, errorMessageWithdraw, errorUserDontExists } from '../../ErrorMessages';
import { db } from '../../firebaseConfig';
import UserRepository from '../../Repositories/UserRepository';
import { FiUser } from 'react-icons/fi';
import { HiOutlineFolderAdd } from 'react-icons/hi';
import { BiShoppingBag, BiMoney } from 'react-icons/bi';
import { Navigate } from 'react-router-dom';
import TransactionRepository from '../../Repositories/TransactionsRepository';

const MainScreen = () => {
  const { isOpen: openDepositModal, onOpen: onOpenDepositModal, onClose: closeDepositModal } = useDisclosure();
  const { isOpen: openWithdrawModal, onOpen: onOpenWithdrawModal, onClose: closeWithdrawModal } = useDisclosure();

  const name = localStorage.getItem("name")
  const salary = localStorage.getItem("salary")
  const salaryInt = parseInt(salary as any)
  const type = localStorage.getItem("type")
  //const money: any = localStorage.getItem("money");
  const paymentDay = localStorage.getItem("paymentDay")
  const paymentDayInt = parseInt(paymentDay as any)

  const [deposit, setDeposit] = useState<string>('');
  const [depositType, setDepositType] = useState<string>('');
  const [withdraw, setWithdraw] = useState<string>('');
  const [withdrawType, setWithdrawType] = useState<string>('');
  const [money, setMoney] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const userExist = await UserRepository.checkIfUserExists(name as string);
      if(userExist.data === true){
        console.log("Already in database!");
      }else{
        await UserRepository.createUser(name as string ,salaryInt as number, type as string, paymentDay as string);
        console.log("User not in database, but created!");
      }
    }
    fetchData();
  },[])

  useEffect(() => {
    const fetchMoney = async () => {
      let user = await UserRepository.getUser(name as string);
      return setMoney(user.data.money);
    }
    fetchMoney();
  }, [])
  
  useEffect((): any => {
    const fetch = async () => {
      const user = await UserRepository.checkIfUserExists(name as string);
      if(!user){
        return <Navigate to="/"/>
      }
    }
    fetch();
  },[name, salary, type, paymentDay, money])

  useEffect(() => {
    const getAllTransactionsByUser = async () => {
      let user = await UserRepository.getUser(name as string);
      const userId = user.data._id;
      const transactionsData = await TransactionRepository.getAllByUser(userId);
      transactionsData.data.map((transaction: any) => {
        let date = transaction.createdAt.split("T")[0]
        date = date.split("-").reverse().join("/")
        transaction.createdAt = date
      })
      setTransactions(transactionsData.data);
    }
    getAllTransactionsByUser();
  }, [deposit, money, depositType])

  const addSalary = () => {
    const salaryInt = parseInt(salary as any);
    setMoney(pastValue => pastValue + salaryInt);
    // const moneyInt = parseInt(money as any)
    // const total = moneyInt + salaryInt
    // localStorage.setItem("money", JSON.stringify(total));
    // window.location.reload();
  }

  const handleDeposit = async () => {
    if(deposit){
      const depositInt = parseInt(deposit as any);
      setMoney(pastValue => pastValue + depositInt);
      const user = await UserRepository.getUser(name as string);
      const userId = user.data._id;
      const type = "WON";
      await TransactionRepository.deposit(depositInt, type, depositType, userId);
    }else{
      errorMessageDeposit();
    }
  }

  const handleWithdraw = async () => {
    if(withdraw){
      const withdrawInt = parseInt(withdraw as any)
      setMoney(pastValue => pastValue - withdrawInt);

      
      // const total = moneyInt - withdrawInt;
      // localStorage.setItem("money", JSON.stringify(total));
      // await addDoc(historyCollection, {money: withdrawInt, type: "LOSS", typeWork: withdrawType, user: name})
      // window.location.reload();
    }else{
      errorMessageWithdraw();
    }
  }

  useEffect(() => {
    const syncMoneyInDatabase = async () => {
      const user = await UserRepository.getUser(name as string);
      if(user.data){
        await UserRepository.syncMoney(user.data._id, money);
      }
    }
    syncMoneyInDatabase();
  }, [money])

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

      <div className=''>
        <nav className='bg-purple-500 h-28 flex justify-between md:justify-center md:gap-96'>
          <h1 className='text-white text-lg font-bold m-4 mt-7 md'>Hey { name } </h1>
          <a href="/config">
            <div className='m-4 mt-6 bg-slate-200 h-11 w-11 rounded-full flex justify-center items-center'>
              <Icon as={FiUser} className=" text-lg cursor-pointer"></Icon>
            </div>
          </a>
        </nav>
        <div className='flex flex-col items-center'>
          <div className='bg-white absolute top-[5rem] w-4/5 h-20 rounded-sm shadow-md flex justify-between md:w-1/5'>
            <div className='m-4'>
              <p className='text-gray-700'>Balance</p>
              <div className='flex items-center gap-2'>
                <p className='text-sm text-gray-700'>U$</p>
                <span className='text-green-500 text-md'>{ money }</span>
              </div>
            </div>
            <div className='mr-12 mt-4'>
              <p>Spending</p>
              <div className='flex items-center gap-2'>
                <p className='text-sm text-gray-700'>U$</p>
                <span className='text-red-500 text-md'> -200</span>
              </div>
            </div>
          </div>
          <div className='bg-slate-50 w-full h-[calc(100vh-112px)]'>
            <div className='mt-20 flex justify-center gap-10'>
              <button onClick={onOpenDepositModal}>
                <div className='flex flex-col items-center gap-1'>
                  <div className='bg-slate-200 h-16 w-16 rounded-full flex justify-center items-center cursor-pointer'>
                    <Icon as={HiOutlineFolderAdd} className="text-xl"></Icon>
                  </div>
                  <h1 className='font-bold text-sm'>Deposit</h1>
                </div>
              </button>
              <button onClick={onOpenWithdrawModal}>
                <div className='flex flex-col items-center gap-1'>
                  <div className='bg-slate-200 h-16 w-16 rounded-full flex justify-center items-center cursor-pointer'>
                    <Icon as={BiShoppingBag} className="text-xl"></Icon>
                  </div>
                  <h1 className='font-bold text-sm'>Shopping</h1>
                </div>
              </button>
              <button onClick={addSalary}>
                <div className='flex flex-col items-center gap-1'>
                  <div className='bg-slate-200 h-16 w-16 rounded-full flex justify-center items-center cursor-pointer'>
                    <Icon as={BiMoney} className="text-xl"></Icon>
                  </div>
                  <h1 className='font-bold text-sm'>Add Salary</h1>
                </div>
              </button>
            </div>
            <div className='mt-10 flex flex-col gap-5'>
              <h1 className="font-bold px-8 mb-5">Latest Transactions</h1>
              {transactions.map((item) => (
                <div>
                  <div className='flex justify-between items-center'>
                    <div className='ml-8'>
                      <p className='text-sm text-slate-500'>{item.createdAt}</p>
                      <p>{item.reason}</p>
                    </div>
                    <div className='mr-8'>
                      {item.type === "WON" ? (
                        <h1>U$ <span className='text-green-500'>{item.money}</span></h1>
                      ): (
                        <h1>U$ <span className='text-red-500'>{item.money}</span></h1>
                      )}
                  
                    </div>
                  </div>
                  <hr className='mt-2 w-[90%] m-auto'/>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
    </>
    
  );
}

export default MainScreen;