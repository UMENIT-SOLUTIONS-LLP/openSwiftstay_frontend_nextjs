import React, { useState } from "react";

export default function useLoader() {
  const [loading, setLoading] = useState(false);

  const showLoader = async (text = "Please wait...") => {
    // add loading div to body
    document.body.getElementsByClassName("loader")[0].classList.add("show");
    setLoading(true);
  };

  const hideLoader = () => {
    // remove loading div from body
    document.body.getElementsByClassName("loader")[0].classList.remove("show");
    setLoading(false);
  };

  return { showLoader, hideLoader, loading };
}
