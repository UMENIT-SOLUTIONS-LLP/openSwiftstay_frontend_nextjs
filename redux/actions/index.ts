import { LOCAL_STORAGE_KEYS } from "@/config/constants";
import axios from "axios";
import moment from "moment-timezone";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultOptions = {
  baseURL: `${PUBLIC_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
};

// Create instance
let instance = axios.create(defaultOptions);

// Set the AUTH token for any request
instance.interceptors.request.use(function (config: any) {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_TOKEN_KEY);
  config.headers.Authorization = token ? `Bearer ${token}` : "";

  if (config.url?.includes("uploadFile")) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    const { data } = response || {};
    return data;
  },
  function (error) {
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    const response = error?.response?.data || error;
    return Promise.reject(response);
  }
);

const getQueryString = (params: any) => {
  if (!params) {
    return "";
  }
  const query = Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");
  return query;
};

const invokeApi = async ({ method = "GET", url, data, options = {} }: any) => {
  const response: any = await instance({
    method,
    url,
    data,
    ...options,
  });
  return response;
};

export const getAppSetting = () => {
  return invokeApi({
    method: "GET",
    url: "/app/setting",
  });
};

export const uploadFile = (data: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/Upload/uploadFile",
    data,
  });
};

/****************** AUTH API *************************/

export const login = (data: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/login",
    data,
  });
};

export const forgotPassword = (data: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/forgotPassword",
    data,
  });
};

export const resetPassword = (data: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/resetPassword",
    data,
  });
};

export const checkToken = (data: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/checkToken",
    data,
  });
};

/****************** USER API *************************/

export const getProfile = () => {
  return invokeApi({
    method: "GET",
    url: "/v1/admin/getProfile",
  });
};

export const getDashboardData = (data?: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/dashboard?${queryString}`,
  });
};

/****************** Location API *************************/

export const addLocation = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/addLocation",
    data,
  });
};

export const getLocation = (data?: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getLocation?${queryString}`,
  });
};

export const getLocationByID = (id?: any) => {
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getLocation/${id}`,
  });
};

export const updateLocation = (data: any, id?: any) => {
  return invokeApi({
    method: "PUT",
    url: `/v1/admin/updateLocation/${id}`,
    data,
  });
};

export const deleteLocation = (id?: any) => {
  return invokeApi({
    method: "DELETE",
    url: `/v1/admin/deleteLocation/${id}`,
  });
};

export const downloadDeviceFile = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/getFIle",
    data,
  });
};
/****************** Driver API *************************/

export const addDriver = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/addUser",
    data,
  });
};

export const getDriver = (data?: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getUser/?${queryString}`,
  });
};

export const getDriverByID = (id?: any) => {
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getUser/${id}`,
  });
};

export const updateDriver = (data: any, id?: any) => {
  return invokeApi({
    method: "PUT",
    url: `/v1/admin/updateUser/${id}`,
    data,
  });
};

export const deleteDriver = (id?: any) => {
  return invokeApi({
    method: "DELETE",
    url: `/v1/admin/deleteUser/${id}`,
  });
};

/****************** Transaction API *************************/

export const getTransaction = (data?: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getTransactions/?${queryString}`,
  });
};

/****************** Booking API *************************/

export const getBooking = (data: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getBooking/?${queryString}`,
  });
};

export const getBookingByID = (id?: any) => {
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getBooking/${id}`,
  });
};

export const getReports = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/getReports",
    data,
    options: {
      headers: {
        timezone: moment.tz.guess(),
      },
    },
  });
};

/****************** Fleet Manager API *************************/
export const getAllCompanies = (data?: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getCompany/?${queryString}`,
  });
};

export const getCompanyByID = (id?: any) => {
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getCompany/${id}`,
  });
};

export const addCompany = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/addComapny",
    data,
  });
};

export const updateCompany = (data: any, id?: any) => {
  return invokeApi({
    method: "PUT",
    url: `/v1/admin/updateComapny/${id}`,
    data,
  });
};

export const deleteCompany = (id?: any) => {
  return invokeApi({
    method: "DELETE",
    url: `/v1/admin/deleteComapny/${id}`,
  });
};

export const companyDriver = (data?: any, id?: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/comapnyDriver/${id ? id : ""}?${queryString}`,
  });
};

export const getAllDriver = (data?: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/drivers/?${queryString}`,
  });
};

export const blockFleetDriver = (data: any) => {
  return invokeApi({
    method: "POST",
    url: `/v1/admin/blockDrivers`,
    data,
  });
};

export const deleteFleetDriver = (data: any, id?: any) => {
  return invokeApi({
    method: "DELETE",
    url: `/v1/admin/deletedriver/${id}`,
    data,
  });
};

export const getCompanyDriverBooking = (data?: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getBooking/?${queryString}`,
  });
};

export const createCompanyBooking = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/createCopmanyBooking",
    data,
  });
};

export const editCompanyBooking = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/editCopmanyBooking",
    data,
  });
};

export const checkUser = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/checkUser",
    data,
  });
};

export const assignDriver = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/assignDriver",
    data,
  });
};

export const createUser = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/createUser",
    data,
  });
};

export const getCompanyReports = (data: any, id: any) => {
  const queryString = new URLSearchParams(id)?.toString();
  return invokeApi({
    method: "POST",
    url: `/v1/admin/getCompanyReports/?${queryString}`,
    data,
    options: {
      headers: {
        timezone: moment.tz.guess(),
      },
    },
  });
};

/****************** Owners API *************************/

export const inviteOwner = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/inviteOwner",
    data,
  });
};

export const getOwner = (data?: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getOwners/?${queryString}`,
  });
};

export const getAllOwner = (data?: any) => {
  const queryString = new URLSearchParams(data)?.toString();
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getAllOwners/?${queryString}`,
  });
};

export const getOwnerByID = (id?: any) => {
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getOwners/${id}`,
  });
};

export const changeOwnerPassword = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/changeOwnerPassword",
    data,
  });
};

export const updateOwner = (data: any, id?: any) => {
  return invokeApi({
    method: "PUT",
    url: `/v1/admin/updateOwner/${id}`,
    data,
  });
};

export const deleteOwner = (id?: any) => {
  return invokeApi({
    method: "DELETE",
    url: `/v1/admin/deleteOwner/${id}`,
  });
};

/****************** CMS API *************************/

export const addCMS = (data?: any) => {
  return invokeApi({
    method: "POST",
    url: "/v1/admin/addCms",
    data,
  });
};

export const getCMS = () => {
  return invokeApi({
    method: "GET",
    url: `/v1/admin/getCms`,
  });
};
