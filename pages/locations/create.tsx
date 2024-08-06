import React from "react";
import Breadcrumb from "@/components/UI/Breadcrumbs/Breadcrumb";
import LocationForm from "@/components/Forms/LocationForm";
import withPermission from "@/components/Permissions";

const Addlocation = () => {
  return (
    <>
      <Breadcrumb
        pages={[
          { name: "Locations", url: "/locations" },
          { name: "Add location", url: "/locations", active: true },
        ]}
      />
      <LocationForm type={"add"} />
    </>
  );
};

export default withPermission(Addlocation);
