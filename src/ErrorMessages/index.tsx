import { toast } from "react-toastify";

export const errorMessageWithdraw = () => {
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


export const errorMessageDeposit = () => {
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