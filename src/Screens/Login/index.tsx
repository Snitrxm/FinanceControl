import { Button, FormLabel, Input } from "@chakra-ui/react";
import { useState } from 'react'
import { errorFillLoginInput, errorSalaryIsIncorrect, errorUserDontExists } from '../../ErrorMessages';
import UserRepository from "../../Repositories/UserRepository";
import { useNavigate } from "react-router-dom";
import LoginUserService from "../../Services/LoginUserService";

const LoginScreen = () => {
  const [name, setName] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const navigation = useNavigate();

  const handleLogin = async () => {
    if(name && salary){
      const user = await UserRepository.getUser(name as string);
      if(user.data){
        if(user.data.salary === Number(salary)){
          await LoginUserService.execute({
            name: name as string,
            salary: salary as string,
            type: user.data.type as string,
            paymentDay: user.data.paymentDay as string
          })
          navigation('/index');
        }else{
          errorSalaryIsIncorrect();
        }
      }else{
        errorUserDontExists();
      }
    }else{
      errorFillLoginInput();
    }
  }


  return (
    <>
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center border rounded-md p-5 flex flex-col gap-10">
          <h1 className="font-bold text-2xl">Login</h1>
          <div>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Andre' value={name} onChange={name => setName(name.target.value)}></Input>
          </div>
          <div>
            <FormLabel>Salary</FormLabel>
            <Input placeholder='2500' value={salary} onChange={salary => setSalary(salary.target.value)}></Input>
          </div>
            <Button colorScheme="purple" onClick={handleLogin}>Login</Button>
            <a href="/" className="mt-[-2rem]"><Button colorScheme="purple" className="w-full">Back</Button></a>
        </div>
      </div>
    </> 
  )
}

export default LoginScreen;