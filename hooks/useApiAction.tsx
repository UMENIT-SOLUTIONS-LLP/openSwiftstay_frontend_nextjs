import useLoader from "@/hooks/useLoader";
import { showError, showSuccess } from "@/utils/helper";

const useApiAction = () => {
  const { showLoader, hideLoader } = useLoader();

  const performApiAction = async (
    apiFunction: any,
    messages: { successMessage?: any; errorMessage?: string } = {
      successMessage: "Success",
      errorMessage: "Error!",
    },
    data: any,
    id?: any
  ) => {
    try {
      showLoader();
      const res = await (id ? apiFunction(data, id) : apiFunction(data))
      const { status, data: responseData, message } = res || {};
      if (!status) {
        const { message } = responseData;
        showError(message || messages?.errorMessage);
        return null;
      }
      messages?.successMessage &&
        showSuccess(message || messages?.successMessage);
      return responseData;
    } catch (err: any) {
      const { message } = err;
      showError(message || messages?.errorMessage);
      return null;
    } finally {
      hideLoader();
    }
  };

  return { performApiAction };
};

export default useApiAction;
