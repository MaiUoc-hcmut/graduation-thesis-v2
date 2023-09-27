import { toast, ToastOptions, ToastPosition, Theme } from 'react-toastify';


const toastConfigError: ToastOptions = {
    position: 'bottom-left' as ToastPosition,
    autoClose: 2000 as number,
    pauseOnHover: true as boolean,
    draggable: false as boolean,
    theme: 'dark' as Theme,
};

const toastConfigSuccess: ToastOptions = {
    position: 'top-center' as ToastPosition,
    autoClose: 2000 as number,
    pauseOnHover: true as boolean,
    draggable: false as boolean,
    theme: 'light' as Theme,
};

export const toastError = (message: string) => {
    toast.error(message, toastConfigError);
};

export const toastSuccess = (message: string) => {
    toast.success(message, toastConfigSuccess);
};