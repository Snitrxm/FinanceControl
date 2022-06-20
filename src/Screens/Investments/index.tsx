import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const InvestmentsScreen = () => {
  const name = localStorage.getItem("name");
  const navigation = useNavigate();

  const handleBack = () => {
    navigation('/index');
  }

  return (
    <div>
      <nav className="bg-purple-500 h-28 flex justify-center items-center">
        <ArrowBackIcon className="absolute left-5 top-5 text-xl" onClick={handleBack}></ArrowBackIcon>
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-white font-bold text-2xl">Hello, { name }</h1>
          <p className="text-white">Welcome to your investments</p>
        </div>
      </nav>
    </div>
  );
}

export default InvestmentsScreen;