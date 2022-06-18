import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure, Icon, RadioGroup
} from '@chakra-ui/react';
import { useState } from 'react';
import { successChangeCoinType, successDeleteUser, successMessageChangeSalary, successMessageResetBalance } from "../../SuccessMessages";
import { errorMessageChangeSalary, errorResetBalance } from "../../ErrorMessages";
import { ToastContainer } from "react-toastify";
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

const ConfigScreen = () => {
  const [newSalary, setNewSalary] = useState<string>('');
  const [nameConfirm, setNameConfirm] = useState<string>('');
  const navigation = useNavigate();

  const { isOpen: openNewSalaryModal, onOpen: onOpenNewSalarytModal, onClose: closeNewSalaryModal } = useDisclosure();
  const { isOpen: openDeleteModal, onOpen: onOpenDeletetModal, onClose: closeDeleteModal } = useDisclosure();
  const { isOpen: openCoinTypeModal, onOpen: onOpenCoinTypetModal, onClose: closeCoinTypeModal } = useDisclosure();
  const { isOpen: openResetBalanceModal, onOpen: onOpenResetBalanceModal, onClose: closeResetBalanceModal } = useDisclosure();

  const name = localStorage.getItem("name");

  const [selectedRadioBtn, setSelectRadioBtn] = useState<string>('radio1');

  const isRadioSelect = (value: string): boolean => selectedRadioBtn === value;

  const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void => setSelectRadioBtn(e.currentTarget.value);
  
  const handleChangeSalaray = async () => {
    const user = await UserRepository.getUser(name as string);
    if(newSalary && newSalary !== user.data.salary && newSalary !== ''){
      const newSalaryInt = parseInt(newSalary);
      const response = await UserRepository.changeSalary(user.data._id as string, newSalaryInt as number);
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
      let user = await UserRepository.getUser(name as string);
      await UserRepository.deleteUser(user.data._id);
      await TransactionRepository.deleteAllTransactionByUser(user.data._id);
      await LocalStorageRepository.delete("name", "salary", "type", "paymentDay");
      successDeleteUser();
      navigation('/');
    }else{
      errorDeletingUser();
    }
    setNameConfirm("");
  }

  const handleChangeCoinType = async () => {
    const res = await ChangeCoinTypeService.execute(selectedRadioBtn as string);
    if(res === true){
      successChangeCoinType(selectedRadioBtn as string);
    }
  }

  const handleResetBalance = async () => {
    const user = await UserRepository.getUser(name as string);
    const response = await UserRepository.resetBalance(user.data._id as string);
    await TransactionRepository.deleteAllTransactionByUser(user.data._id as string);
    if(response.data){
      successMessageResetBalance();
    }else{
      errorResetBalance();
    }
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

      
      <div>
        <nav className="bg-purple-500 h-28 flex justify-center items-center">
          <h1 className="text-white font-bold text-2xl">Hello, { name }</h1>
        </nav>
        <div className="m-5">
          <a href="/index">
            <ArrowBackIcon className='text-xl'></ArrowBackIcon>
          </a>
        </div>
        <div className="flex flex-col items-center mt-10 gap-10">
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