import { toast } from "react-toastify";

export const successMessageChangeSalary = () => {
  toast.success('Successfully changed salary', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
