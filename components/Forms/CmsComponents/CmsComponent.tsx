import React, { useEffect, useState } from "react";
import Button from "@/components/UI/Button";
import "react-quill/dist/quill.snow.css";
import { showError, showSuccess } from "@/utils/helper";
import useLoader from "@/hooks/useLoader";
import dynamic from "next/dynamic";
import { addCMS, getCMS } from "@/redux/actions";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CmsComponent = ({ type = "aboutUs", label = "About us" }: any) => {
  const { showLoader, hideLoader } = useLoader();
  const [cms, setCms] = useState([]);
  const [value, setValue] = useState("");

  const getCms = async () => {
    try {
      showLoader();
      const res = await getCMS();
      const { status, data } = res || {};
      if (!status) {
        const { message } = data;
        showError(message, "Error!");
        return;
      }
      setCms(data);
      setValue(data?.[type]);
    } catch (err: any) {
      const { message } = err;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    setValue(cms?.[type]);
  }, [type]);

  const addCms = async (cmsData: any) => {
    try {
      showLoader();
      const res = await addCMS(cmsData);
      const { data, status, message } = res || {};
      if (!status) {
        showError(message);
        return;
      }
      getCms();
      showSuccess(message);
    } catch (error: any) {
      const { message } = error;
      showError(message, "Error!");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getCms();
  }, []);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      // ["blockquote", "code-block"],
      [{ script: "sub" }, { script: "super" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }, { align: "center" }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
      ["undo"],
    ],
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "indent",
    "list",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "formula",
  ];

  return (
    <div>
      <div className="flex justify-between my-8">
        <p className="text-title-md font-semibold text-black dark:text-white">
          {label}
        </p>
        <Button
          onClick={() => {
            addCms({ [type]: value });
          }}
          type="submit"
          className="bg-secondary text-white justify-center"
        >
          Save
        </Button>
      </div>
      <ReactQuill
        theme="snow"
        className="text-black bg-white"
        modules={modules}
        formats={formats}
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export default CmsComponent;
