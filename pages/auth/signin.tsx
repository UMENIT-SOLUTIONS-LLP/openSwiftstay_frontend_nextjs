import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showError } from "@/utils/helper";
import useLoader from "@/hooks/useLoader";
import { login } from "@/redux/actions";
import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";

const SignIn: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (formData: any) => {
    try {
      showLoader();
      const res = await login(formData);
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      const { accessToken, ...profile } = data || {};
      dispatch({ type: "SET_AUTH_TOKEN", payload: { token: accessToken } });
      dispatch({
        type: "SET_USER_PROFILE",
        payload: { profile: profile },
      });
      router.push("/dashboard");
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  return (
    <>
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
            <div className="w-full p-4 sm:p-10.5 xl:p-10.5">
              <h5 className=" text-2xl text-center font-bold text-black dark:text-white sm:text-title-xl2">
                Log In
              </h5>
              <p className="mb-5 mt-2 text-center">
                Welcome back! Please enter your details.
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
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter the correct email address",
                      },
                    }}
                  />
                </div>

                <div className="mb-6">
                  <TextInput
                    placeholder="Enter your password"
                    type="password"
                    name="password"
                    control={control}
                    errors={errors}
                    label="Password"
                    rules={{
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    }}
                  />
                </div>
                <Link
                  className="flex m-auto w-fit text-sm text-primary font-bold"
                  href={"/auth/forgotpass"}
                >
                  <p>Forgot password?</p>
                </Link>
                <div className="mt-5">
                  <Button
                    type="submit"
                    className="w-full bg-primary justify-center font-semibold h-12 text-lg text-white"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
