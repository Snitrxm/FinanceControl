import {
  Button, Icon, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { errorMessageDeposit, errorMessageWithdraw } from '../../ErrorMessages';
import UserRepository from '../../Repositories/UserRepository';
import { FiUser } from 'react-icons/fi';
import { HiOutlineFolderAdd } from 'react-icons/hi';
import { BiShoppingBag, BiMoney } from 'react-icons/bi';
import TransactionRepository from '../../Repositories/TransactionsRepository';

const MainScreen = () => {
  const { isOpen: openDepositModal, onOpen: onOpenDepositModal, onClose: closeDepositModal } = useDisclosure();
  const { isOpen: openWithdrawModal, onOpen: onOpenWithdrawModal, onClose: closeWithdrawModal } = useDisclosure();

  const name = localStorage.getItem("name")
  const salary = localStorage.getItem("salary")
  const salaryInt = parseInt(salary as string);
  const type = localStorage.getItem("type")
  const paymentDay = localStorage.getItem("paymentDay")
  const coinType = localStorage.getItem("coinType")

  const [deposit, setDeposit] = useState<string>('');
  const [depositType, setDepositType] = useState<string>('');
  const [withdraw, setWithdraw] = useState<string>('');
  const [withdrawType, setWithdrawType] = useState<string>('');
  const [money, setMoney] = useState<number>(0);
  const [moneySpending, setMoneySpending] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [getPaymented, setGetPayement] = useState<boolean>(false);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userExist = await UserRepository.checkIfUserExists(name as string);
      if(userExist.data === true){
        console.log("Already in database!");  
      }else{
        if(!name || !salary || !type || !paymentDay){
          await UserRepository.deleteUser(document.cookie);
          await TransactionRepository.deleteAllTransactionByUser(document.cookie);
          navigation('/');
        }else{
          const user = await UserRepository.createUser(name as string ,salaryInt as number, type as string, paymentDay as string);
          document.cookie = user.data._id;
          console.log("User not in database yet, creating...");
        }
      }
    }
    fetchData();
  },[name, salary, type, paymentDay, salaryInt]);

  useEffect(() => {
    const fetchMoney = async () => {
      let user = await UserRepository.getUser(name as string);
      setMoney(user.data.money);
      setMoneySpending(user.data.moneySpending);
    }
    fetchMoney();
  }, [getPaymented, name])
  
  useEffect((): void => {
    const fetchCheckUser = async () => {
      const user = await UserRepository.checkIfUserExists(name as string);
      if(!user){
        navigation('/');
      }
    }
    fetchCheckUser();
  },[name, salary, type, paymentDay, money])

  useEffect(() => {
    const getAllTransactionsByUser = async () => {
      let user = await UserRepository.getUser(name as string);
      const userId = user.data._id;
      const transactionsData = await TransactionRepository.getAllByUser(userId);
      transactionsData.data.map((transaction: any) => {
        let date = transaction.createdAt.split("T")[0]
        date = date.split("-").reverse().join("/")
        transaction.createdAt = date;
        return 0;
      })
      setTransactions(transactionsData.data);
    }
    getAllTransactionsByUser();
  }, [money, name])

  // useEffect(() => {
  //   const fetchPayment = async () => {
  //     let day: any = new Date();
  //     day = day.getDate();
  //     if(day === paymentDayInt){
  //       if(counter === 1){
  //         console.log("ja pagou")
  //       }else{
  //         const user = await UserRepository.getUser(name as string);
  //         const total = user.data.money + salaryInt;
  //         const r = await UserRepository.getPayment(user.data._id, total);
  //         setGetPayement(true);
  //         console.log(r);
  //         setCounter(1);
  //         // const userId = user.data._id;
  //         // await TransactionRepository.deposit(salaryInt, "WON", "Salary", userId);
  //       }
  //     }
  //   }
  //   fetchPayment();
  // }, []);


  const addSalary = async () => {
    const salaryInt = parseInt(salary as any);
    setMoney(pastValue => pastValue + salaryInt);
    const user = await UserRepository.getUser(name as string);
    const userId = user.data._id;
    await TransactionRepository.deposit(salaryInt, "WON", "Salary", userId);
  }

  const handleDeposit = async () => {
    if(deposit && depositType){
      const depositInt = parseInt(deposit as any);
      setMoney(pastValue => pastValue + depositInt);
      const user = await UserRepository.getUser(name as string);
      const userId = user.data._id;
      const type = "WON";
      await TransactionRepository.deposit(depositInt, type, depositType, userId);
      setDeposit("");
      setDepositType("");
    }else{
      errorMessageDeposit();
    }
  }

  const handleWithdraw = async () => {
    if(withdraw && withdrawType){
      const withdrawInt = parseInt(withdraw as any)
      setMoney(pastValue => pastValue - withdrawInt);
      setMoneySpending(pastValue => pastValue + withdrawInt);
      const user = await UserRepository.getUser(name as string);
      const userId = user.data._id;
      const type = "LOSS";
      await TransactionRepository.deposit(withdrawInt, type, withdrawType, userId);
      setWithdraw("");
      setWithdrawType("");
    }else{
      errorMessageWithdraw();
    }
  }

  useEffect(() => {
    const syncMoneyInDatabase = async () => {
      const user = await UserRepository.getUser(name as string);
      if(user.data){
        await UserRepository.syncMoney(user.data._id, money);
        await UserRepository.syncMoneySpending(user.data._id, moneySpending);
      }
    }
    syncMoneyInDatabase();
  }, [money])

  return (
    <>
    <Modal isOpen={openDepositModal} onClose={closeDepositModal} size="xs">
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

      <Modal isOpen={openWithdrawModal} onClose={closeWithdrawModal} size="xs">
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
                <p className='text-sm text-gray-700'>{coinType ? coinType : "U$"}</p>
                {money >= 0 ? (
                  <span className='text-green-500 text-md'>{ money }</span>
                ) : (
                  <span className='text-red-500 text-md'>{ money }</span>
                )}
              </div>
            </div>
            <div className='mr-12 mt-4'>
              <p>Spending</p>
              <div className='flex items-center gap-2'>
                <p className='text-sm text-gray-700'>{coinType ? coinType : "U$"}</p>
                <span className='text-red-500 text-md'> -{ moneySpending }</span>
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
            <div className='mt-10 flex flex-col gap-5 md:w-1/5 md:m-auto md:mt-11'>
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
                        <h1>{coinType ? coinType : "U$"} <span className='text-green-500'>{item.money}</span></h1>
                      ): (
                        <h1>{coinType ? coinType : "U$"} <span className='text-red-500'>{item.money}</span></h1>
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