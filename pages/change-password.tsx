import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { showError } from "@/utils/helper";
import useLoader from "@/hooks/useLoader";
import { resetPassword } from "@/redux/actions";
import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";

const ResetPass: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const [emailSent, setEmailSent] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const handleFormSubmit = async (formData: any) => {
    try {
      showLoader();
      const res = await resetPassword(formData);
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      setEmailSent(true);
    } catch (err: any) {
      const { message } = err;
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
                    placeholder="Enter your password"
                    type="password"
                    name="oldPassword"
                    control={control}
                    errors={errors}
                    label="Password"
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
                    placeholder="Enter your password"
                    type="password"
                    name="confirm_password"
                    control={control}
                    errors={errors}
                    label="Confirm password"
                    rules={{
                      required: "Please enter your password",
                      minLength: {
                        value: 8,
                        message: "Password doesn't match",
                      },
                    }}
                  />
                </div>
                <div className="mt-5">
                  <Button
                    type="submit"
                    className="w-full bg-primary justify-center font-semibold h-12 text-lg text-white"
                  >
                    Reset password
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
                Password reset
              </h5>
              <p className="mt-2 mb-8 text-center">
                Your password has been successfully reset. Click below to log in
                manually.
              </p>
              <Link
                className=" w-full text-sm text-primary font-bold"
                href={"/auth/signin"}
              >
                <Button className="bg-primary justify-center font-semibold h-12 text-white">
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

export default ResetPass;
