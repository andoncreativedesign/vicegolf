import { toast, ToastContainer, type ToastOptions, type UpdateOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="custom-toast-container"
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
      progressClassName="custom-toast-progress"
    />
  );
};

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      ...options,
      className: 'custom-toast custom-toast-success',
    });
  },
  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      ...options,
      className: 'custom-toast custom-toast-error',
    });
  },
  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      ...options,
      className: 'custom-toast custom-toast-info',
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      ...options,
      className: 'custom-toast custom-toast-warning',
    });
  },
  default: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...options,
      className: 'custom-toast custom-toast-default',
    });
  },
  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  },
  update: (id: string | number, options: UpdateOptions) => {
    return toast.update(id, options);
  },
};

export default showToast;
