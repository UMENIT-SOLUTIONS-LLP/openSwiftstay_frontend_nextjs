import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { showError, showSuccess } from "@/utils/helper";
import Image from "next/image";
import Button from "@/components/UI/Button";
import Link from "next/link";
import useLoader from "@/hooks/useLoader";
import TextInput from "@/components/UI/TextInput";
import { checkToken, resetPassword } from "@/redux/actions";
import { useRouter } from "next/router";

const SetPassword = () => {
  const router = useRouter();
  const { id = null } = router?.query ?? {};
  const [emailSent, setEmailSent] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const watchPassword = useWatch({ control, name: "password" });
  const watchConfirmPassword = useWatch({ control, name: "newPassword" });

  const checkUserToken = async (id: string) => {
    try {
      showLoader();
      const res = await checkToken({ id });
      const { data, status, message } = res || {};
      if (!status) {
        return;
      }
    } catch (error: any) {
      const { message } = error;
      showError(message, "This url has expired !!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    localStorage.clear();
    const asideElement = document?.querySelector("aside");
    if (asideElement) {
      asideElement.style.display = "none";
    }
    if (id) {
      checkUserToken(id.toString());
    }
  }, [id]);

  useEffect(() => {
    if (watchPassword !== watchConfirmPassword) {
      setError("newPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      setError("newPassword", {});
    }
  }, [watchPassword, watchConfirmPassword, setError]);

  const handleFormSubmit = async (formData: any) => {
    try {
      showLoader();
      if (formData?.password !== formData?.newPassword) {
        showError("Passwords do not match", "Error!");
        return;
      }
      const res = await resetPassword({
        id,
        newPassword: formData?.newPassword,
      });
      const { status, message } = res || {};
      if (!status) {
        return;
      }
      setEmailSent(true);
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
    <div className="bg-[url('/images/logo/loginBg.svg')] -m-6 flex-col bg-center items-center bg-contain bg-no-repeat relative flex justify-start h-screen">
      <div className="w-40 mb-4 mt-10">
        <Image
          src={"/images/logo/headerlogo.svg"}
          alt="Header logo"
          width={40}
          height={20}
          layout="responsive"
          className=""
          objectFit="cover"
        />
      </div>
      <div className="rounded-xl w-3/4 sm:w-2/3 md:w-115 h-fit bg-white shadow-xl dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          {!emailSent ? (
            <div className="w-full p-4 sm:p-10.5 xl:p-10.5">
              <h5 className=" text-2xl text-center font-bold text-black dark:text-white sm:text-title-xl2">
                Set new password
              </h5>
              <p className="mb-5 mt-2 text-center">
                Your new password must be different to previously used
                passwords.
              </p>

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
                    name="newPassword"
                    rules={{
                      required: "Please enter your password",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    }}
                  />
                </div>
                <div className="mt-5">
                  <Button
                    type="submit"
                    className="w-full bg-primary justify-center font-semibold h-12 text-lg text-white"
                  >
                    Set password
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="w-full p-4 sm:p-10.5 xl:p-10.5">
              <div className="w-full flex justify-center mb-4">
                <Image
                  src={"/images/icon/resetauth.svg"}
                  alt="Email"
                  width={40}
                  height={20}
                  className=""
                  objectFit="cover"
                />
              </div>
              <h5 className=" text-2xl text-center font-bold text-black dark:text-white sm:text-title-xl2">
                Set Password
              </h5>
              <p className="mt-2 mb-8 text-center">
                Your password has been set successfully. Click below to log in
                manually.
              </p>
              <Link
                className=" w-full text-sm text-primary font-bold"
                href={"/auth/signin"}
              >
                <Button className="w-full bg-primary justify-center font-semibold h-12 text-white">
                  Continue
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
