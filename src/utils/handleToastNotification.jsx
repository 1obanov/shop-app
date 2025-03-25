import { toast, Slide } from "react-toastify";

const handleToastNotification = (message) => {

  toast.success(<span>{message}</span>,
    {
      autoClose: 3000,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      transition: Slide,
    }
  );

  return true;
};

export { handleToastNotification };
