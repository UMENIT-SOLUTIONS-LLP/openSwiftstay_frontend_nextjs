import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@/components/UI/Button";
import Breadcrumb from "@/components/UI/Breadcrumbs/Breadcrumb";
import LocationForm from "@/components/Forms/LocationForm";
import withPermission from "@/components/Permissions";

const Editlocation = () => {
  const router = useRouter();
  const { id } = router.query;
  const [breadCrumbName, setBreadCrumbName] = useState("");

  const setBreadName = (name: string) => {
    setBreadCrumbName(name);
  };

  return (
    <>
      <Breadcrumb
        pages={[
          { name: `Locations`, url: `/locations/${id}` },
          {
            name: `${breadCrumbName} > Edit location`,
            url: `/locations/${id}`,
            active: true,
          },
        ]}
      />
      <LocationForm
        type={"edit"}
        setBreadName={setBreadName}
        id={id?.toString()}
      />
    </>
  );
};

export default withPermission(Editlocation);
