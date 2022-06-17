import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure, Icon, RadioGroup, Stack
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { successMessageChangeSalary } from "../../SuccessMessages";
import { errorMessageChangeSalary } from "../../ErrorMessages";
import { ToastContainer } from "react-toastify";
import UserRepository from "../../Repositories/UserRepository";
import LocalStorageRepository from "../../Repositories/LocalstorageRepository";
import { FaExchangeAlt} from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { errorDeletingUser } from '../../ErrorMessages';
import TransactionRepository from "../../Repositories/TransactionsRepository";
import { BsCoin } from 'react-icons/bs'
import { Radio } from "flowbite-react";

const ConfigScreen = () => {
  const [newSalary, setNewSalary] = useState<string>('');
  const [nameConfirm, setNameConfirm] = useState<string>('');
  const [coinType, setCoinType] = useState<string>('');

  const { isOpen: openNewSalaryModal, onOpen: onOpenNewSalarytModal, onClose: closeNewSalaryModal } = useDisclosure();
  const { isOpen: openDeleteModal, onOpen: onOpenDeletetModal, onClose: closeDeleteModal } = useDisclosure();
  const { isOpen: openCoinTypeModal, onOpen: onOpenCoinTypetModal, onClose: closeCoinTypeModal } = useDisclosure();

  const name = localStorage.getItem("name");
  


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
      window.location.href = "/";
    }else{
      errorDeletingUser();
    }
    setNameConfirm("");
  }

  const handleChangeCoinType = async () => {
    console.log(coinType);
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
          <ModalHeader>How much is your new salary?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup value={coinType} onChange={setCoinType} name="coinType">
              <p>In Procution...</p>
            </RadioGroup>
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

      <ToastContainer></ToastContainer>
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