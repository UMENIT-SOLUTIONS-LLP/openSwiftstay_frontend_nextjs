import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { showError } from "@/utils/helper";
import useLoader from "@/hooks/useLoader";
import { forgotPassword } from "@/redux/actions";
import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";
import { FaArrowLeft } from "react-icons/fa";

const ForgotPass: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const [emailSent, setEmailSent] = useState(false);
  const [emailid, setEmailid] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const handleFormSubmit = async (formData: any) => {
    try {
      setEmailid(formData?.email);
      showLoader();
      const res = await forgotPassword(formData);
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
                Forgot password?
              </h5>
              <p className="mb-5 mt-2 text-center">
                No worries, we&apos;ll send you reset instructions.
              </p>

              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="mb-4">
                  <TextInput
                    placeholder="Enter your email"
                    type="text"
                    name="email"
                    control={control}
                    errors={errors}
                    label="Email"
                    rules={{
                      required: "Please enter your email address",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    }}
                  />
                </div>
                <div className="mt-5">
                  <Button
                    type="submit"
                    className="bg-primary w-full justify-center font-semibold h-12 text-lg text-white"
                  >
                    Reset password
                  </Button>
                </div>
                <Link
                  className="flex m-auto w-fit text-sm text-primary font-bold"
                  href={"/auth/signin"}
                >
                  <p className="flex place-items-center mt-8">
                    <FaArrowLeft /> <span className="ml-4">Back to log in</span>
                  </p>
                </Link>
              </form>
            </div>
          ) : (
            <div className="w-full p-4 sm:p-10.5 xl:p-10.5">
              <div className="w-full flex justify-center mb-4">
                <Image
                  src={"/images/icon/emailauth.svg"}
                  alt="Email"
                  width={40}
                  height={20}
                  className=""
                  objectFit="cover"
                />
              </div>
              <h5 className="text-2xl text-center font-bold text-black dark:text-white sm:text-title-xl2">
                Check your email
              </h5>
              <p className="mt-2 text-center">
                We sent a password reset link to
              </p>
              <p className="mb-5 mt-1 text-center">{emailid}</p>
              <p className="mb-8 text-sm text-center">
                Didn’t receive the email?{" "}
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => handleFormSubmit({ email: emailid })}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFormSubmit({ email: emailid });
                    }
                  }}
                >
                  Click to resend
                </span>
              </p>
              <Link
                className="mt-4 m-auto w-full text-sm text-primary font-bold"
                href={"/auth/signin"}
              >
                <Button className="w-full bg-primary justify-center font-semibold h-12 text-white">
                  Ok
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
