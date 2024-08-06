import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { showError, showSuccess } from "@/utils/helper";
import Button from "@/components/UI/Button";
import Link from "next/link";
import useLoader from "@/hooks/useLoader";
import TextInput from "@/components/UI/TextInput";
import SwitcherOne from "@/components/UI/Switchers/SwitcherOne";
import { changeOwnerPassword } from "@/redux/actions";

const ChangePassword = (id: any) => {
  const { showLoader, hideLoader } = useLoader();
  const [passwordMatched, setPasswordMatched] = useState(true);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    register,
    setError,
  } = useForm({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const watchPassword = useWatch({ control, name: "password" });
  const watchConfirmPassword = useWatch({ control, name: "confirm_password" });

  useEffect(() => {
    if (watchPassword !== watchConfirmPassword) {
      setError("confirm_password", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      setError("confirm_password", {});
    }
  }, [watchConfirmPassword, setError]);

  const handleFormSubmit = async (formData: any) => {
    try {
      showLoader();
      if (formData?.password !== formData?.confirm_password) {
        showError("Passwords do not match", "Error!");
        return;
      }
      const res = await changeOwnerPassword({
        ...id,
        password: formData?.password,
      });
      const { data, status, message } = res || {};
      if (!status) {
        return;
      }
      showSuccess(message);
      reset();
    } catch (error: any) {
      const { message } = error;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };
  return (
    <>
      <div className="w-5/6 md:w-2/3 lg:w-2/5 m-auto">
        <div className="text-title-lg mt-10 mb-6 font-bold text-black dark:text-white">
          Change password
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="mb-4">
            <TextInput
              placeholder="New password"
              type="password"
              control={control}
              label="New password"
              name="password"
              errors={errors}
              rules={{
                required: "Please enter your password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
            />
          </div>
          <div className="mb-6">
            <TextInput
              placeholder="Confirm password"
              type="password"
              control={control}
              errors={errors}
              label="Confirm password"
              name="confirm_password"
              rules={{
                required: "Please enter your password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
            />
          </div>
          <hr className="my-6 w-full text-bordercolor" />
          <div className="mb-5 w-full mt-4">
            <div className="flex justify-between gap-2">
              <Link className="w-1/2 font-medium" href="/owners">
                <Button type="button" className="w-full justify-center">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                topClassName="w-1/2"
                className="w-full bg-secondary text-white justify-center"
              >
                Change password
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
