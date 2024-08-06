import { TypeOptions, toast } from "react-toastify";

const showToast = (
  message: any,
  title: any = null,
  type: TypeOptions = "success"
) => {
  const position = "top-right";

  toast(message, {
    position,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    type: type,
  });
};

export const showSuccess = (message: any, title: any = null) => {
  showToast(message, title, "success");
};

export const showError = (message: any, title: any = null) => {
  showToast(message, title, "error");
};

export const logoutUser = () => {
  localStorage.clear();
  window.location.href = "/";
};

export const removeProperties = (obj: any, props: any) => {
  const newObj = { ...obj };
  props.forEach((prop: any) => {
    delete newObj[prop];
  });
  return newObj;
};
