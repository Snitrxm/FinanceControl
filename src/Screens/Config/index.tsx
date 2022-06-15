import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { NewSalaryService } from "../../Services/NewSalaryService";
import { DeleteUserAccountService } from "../../Services/DeleteUserAccountService";
import { successMessageChangeSalary } from "../../SuccessMessages";
import { errorMessageChangeSalary } from "../../ErrorMessages";
import { ToastContainer } from "react-toastify";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, doc, query, where, deleteDoc } from '@firebase/firestore';
import UserRepository from "../../Repositories/UserRepository";
import LocalStorageRepository from "../../Repositories/LocalstorageRepository";


const ConfigScreen = () => {
  const [newSalary, setNewSalary] = useState<string>('');

  const { isOpen: openNewSalaryModal, onOpen: onOpenNewSalarytModal, onClose: closeNewSalaryModal } = useDisclosure();

  const name = localStorage.getItem("name");
  const salary = localStorage.getItem("salary");
  const type = localStorage.getItem("type");
  const paymentDay = localStorage.getItem("paymentDay");
  const money = localStorage.getItem("money");

  useEffect(() => {
    if(!name || !salary || !type || !paymentDay || !money) {
      window.location.href = "/";
    }
  },[])

  let newSalaryService = new NewSalaryService();

  const handleChangeSalaray = async () => {
    const response = await newSalaryService.execute({
      newSalary: newSalary,
    })
    if(response === true){
      successMessageChangeSalary();
    }else{
      errorMessageChangeSalary();
    }
  }

  const handleDeleteUserAccount = async () => {
    const user = await UserRepository.getUser(name as string);
    await UserRepository.deleteUser(user.data._id);
    await LocalStorageRepository.delete("name", "salary", "type", "paymentDay", "money");
    window.location.reload();
  }

  return (
    <>
      <Modal isOpen={openNewSalaryModal} onClose={closeNewSalaryModal} size="sm">
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
              Withdraw
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ToastContainer></ToastContainer>
      <div>
        <nav className="bg-green-500 h-24 flex justify-center items-center">
          <h1 className="text-white font-bold text-2xl">Hello, { name }</h1>
        </nav>
        <div className="m-5">
          <a href="/index">
            <ArrowBackIcon className='text-xl'></ArrowBackIcon>
          </a>
        </div>
        <div className="flex flex-col items-center mt-10 gap-10">
          <button className='border rounded-md border-blue-500 px-15 py-5 text-lg w-48 hover:bg-blue-500 transition-colors hover:text-white' onClick={onOpenNewSalarytModal}>Change Salary</button>
          <button className='border rounded-md border-red-500 px-15 py-5 text-lg w-48 hover:bg-red-500 transition-colors hover:text-white' onClick={handleDeleteUserAccount}>Delete Account</button>
        </div>
      </div>
    </>
  )
}

export default ConfigScreen;