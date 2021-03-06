import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure, Icon
} from '@chakra-ui/react';
import { useState } from 'react';
import { successChangeCoinType, successDeleteUser, successMessageChangeSalary, successMessageResetBalance } from "../../SuccessMessages";
import { errorMessageChangeSalary, errorResetBalance } from "../../ErrorMessages";
import UserRepository from "../../Repositories/UserRepository";
import LocalStorageRepository from "../../Repositories/LocalstorageRepository";
import { FaExchangeAlt} from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { errorDeletingUser } from '../../ErrorMessages';
import TransactionRepository from "../../Repositories/TransactionsRepository";
import { BsCoin } from 'react-icons/bs'
import { GrPowerReset } from 'react-icons/gr'
import { useNavigate } from "react-router-dom";
import { ChangeCoinTypeService } from "../../Services/ChangeCoinTypeService";
import { BiLogOut } from "react-icons/bi";
import LogOutUserService from "../../Services/LogOutUserService";
import Loader from "../../Components/Loader";

const ConfigScreen = () => {
  const [newSalary, setNewSalary] = useState<string>('');
  const [nameConfirm, setNameConfirm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigate();

  const { isOpen: openNewSalaryModal, onOpen: onOpenNewSalarytModal, onClose: closeNewSalaryModal } = useDisclosure();
  const { isOpen: openDeleteModal, onOpen: onOpenDeletetModal, onClose: closeDeleteModal } = useDisclosure();
  const { isOpen: openCoinTypeModal, onOpen: onOpenCoinTypetModal, onClose: closeCoinTypeModal } = useDisclosure();
  const { isOpen: openResetBalanceModal, onOpen: onOpenResetBalanceModal, onClose: closeResetBalanceModal } = useDisclosure();
  const { isOpen: openLogOutModal, onOpen: onOpenLogOutModal, onClose: closeLogOutModal } = useDisclosure();

  const name = localStorage.getItem("name");

  const [selectedRadioBtn, setSelectRadioBtn] = useState<string>('radio1');

  const isRadioSelect = (value: string): boolean => selectedRadioBtn === value;

  const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void => setSelectRadioBtn(e.currentTarget.value);
  
  const handleChangeSalaray = async () => {
    setLoading(true);
    const user = await UserRepository.getUser(name as string);
    if(newSalary && newSalary !== user.data.salary && newSalary !== ''){
      const newSalaryInt = parseInt(newSalary);
      const response = await UserRepository.changeSalary(user.data._id as string, newSalaryInt as number);
      setLoading(false);
      if(response.data === true){
        await LocalStorageRepository.set("salary", newSalary);
        successMessageChangeSalary();
      }else{
        errorMessageChangeSalary();
      }
    }
    setNewSalary("");
  }

  const handleDeleteUserAccount = async () => {
    if(nameConfirm && nameConfirm === name){
      setLoading(true);
      let user = await UserRepository.getUser(name as string);
      await UserRepository.deleteUser(user.data._id);
      await TransactionRepository.deleteAllTransactionByUser(user.data._id);
      await LocalStorageRepository.delete("name", "salary", "type", "paymentDay");
      setLoading(false);
      successDeleteUser();
      navigation('/');
    }else{
      errorDeletingUser();
    }
    setNameConfirm("");
  }

  const handleChangeCoinType = async () => {
    setLoading(true);
    const res = await ChangeCoinTypeService.execute(selectedRadioBtn as string);
    setLoading(false);
    if(res === true){
      successChangeCoinType(selectedRadioBtn as string);
    }
  }

  const handleResetBalance = async () => {
    setLoading(true);
    const user = await UserRepository.getUser(name as string);
    const response = await UserRepository.resetBalance(user.data._id as string);
    await TransactionRepository.deleteAllTransactionByUser(user.data._id as string);
    setLoading(false)
    if(response.data){
      successMessageResetBalance();
    }else{
      errorResetBalance();
    }
  }

  const handleLogOut = async () => {
    await LogOutUserService.execute();
    navigation('/')
  }

  const handleGotoIndexPage = () => {
    navigation('/index');
  }

  return (
    <>
      <Modal isOpen={openNewSalaryModal} onClose={closeNewSalaryModal} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How much is your new salary?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="1200" onChange={(newSalary) => setNewSalary(newSalary.target.value)} value={newSalary}></Input>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='whatsapp' mr={3} onClick={() => {
              closeNewSalaryModal();
              handleChangeSalaray();
            }}>
              Change Salary
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={openDeleteModal} onClose={closeDeleteModal} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please write <span className="font-light">{ name }</span> to confirm</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Name" onChange={(nameConfirm) => setNameConfirm(nameConfirm.target.value)} value={nameConfirm}></Input>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => {
              closeDeleteModal();
              handleDeleteUserAccount();
            }}>
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={openCoinTypeModal} onClose={closeCoinTypeModal} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>What type of coin you will chose?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <div className="flex items-center gap-2">
                <input type="radio" name="coinType" value="U$" checked={isRadioSelect('U$')} onChange={handleRadioClick}/>
                <p>U$</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" name="coinType" value="R$" checked={isRadioSelect('R$')} onChange={handleRadioClick}/>
                <p>R$</p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='whatsapp' mr={3} onClick={() => {
              closeCoinTypeModal();
              handleChangeCoinType();
            }}>
              Change Coin Type
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={openResetBalanceModal} onClose={closeResetBalanceModal} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => {
              closeResetBalanceModal();
            }}>
              No
            </Button>
            <Button colorScheme='whatsapp' mr={3} onClick={() => {
              closeResetBalanceModal();
              handleResetBalance();
            }}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={openLogOutModal} onClose={closeLogOutModal} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure to logout?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => {
              closeLogOutModal();
            }}>
              No
            </Button>
            <Button colorScheme='whatsapp' mr={3} onClick={() => {
              closeLogOutModal();
              handleLogOut();
            }}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {loading === true ? <Loader /> : null}
      <div>
        <nav className="bg-purple-500 h-28 flex justify-center items-center">
          <h1 className="text-white font-bold text-2xl">Hello, { name }</h1>
        </nav>
        <div className="m-5">
          <ArrowBackIcon className='text-xl' onClick={handleGotoIndexPage}></ArrowBackIcon>
        </div>
        <div className="flex flex-col items-center mt-10 gap-10 h-[calc(100vh-82px)]">
          <button onClick={onOpenNewSalarytModal}>
              <div className='flex flex-col items-center gap-1'>
                <div className='bg-slate-200 h-16 w-16 rounded-full flex justify-center items-center cursor-pointer'>
                  <Icon as={FaExchangeAlt}></Icon>
                </div>
                <h1 className='font-bold text-sm'>Change Salary</h1>
              </div>
          </button>
          <button onClick={onOpenCoinTypetModal}>
              <div className='flex flex-col items-center gap-1'>
                <div className='bg-slate-200 h-16 w-16 rounded-full flex justify-center items-center cursor-pointer'>
                  <Icon as={BsCoin}></Icon>
                </div>
                <h1 className='font-bold text-sm'>Change Coin Type</h1>
              </div>
          </button>
          <button onClick={onOpenResetBalanceModal}>
              <div className='flex flex-col items-center gap-1'>
                <div className='bg-slate-200 h-16 w-16 rounded-full flex justify-center items-center cursor-pointer'>
                  <Icon as={GrPowerReset}></Icon>
                </div>
                <h1 className='font-bold text-sm'>Reset Balance</h1>
              </div>
          </button>
          <button onClick={onOpenLogOutModal}>
              <div className='flex flex-col items-center gap-1'>
                <div className='bg-slate-200 h-16 w-16 rounded-full flex justify-center items-center cursor-pointer'>
                  <Icon as={BiLogOut}></Icon>
                </div>
                <h1 className='font-bold text-sm'>Log Out</h1>
              </div>
          </button>
          <button onClick={onOpenDeletetModal}>
              <div className='flex flex-col items-center gap-1'>
                <div className='bg-slate-200 h-16 w-16 rounded-full flex justify-center items-center cursor-pointer'>
                  <Icon as={BsTrash}></Icon>
                </div>
                <h1 className='font-bold text-sm'>Delete Account</h1>
              </div>
          </button>
        </div>
      </div>
    </>
  )
}

export default ConfigScreen;