import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "../common/Loader";

const AppShell = () => {
  const router = useRouter();
  const userToken = useSelector((state: any) => state.user.adminToken);
  if (userToken) {
    router.push("/dashboard");
  } else {
    router.push("/auth/signin");
  }

  return (
    <div>
      <Loader />
    </div>
  );
};

export default AppShell;
