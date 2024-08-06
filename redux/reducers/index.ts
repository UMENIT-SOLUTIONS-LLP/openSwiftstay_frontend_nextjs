import { LOCAL_STORAGE_KEYS } from "@/config/constants";
import { combineReducers } from "@reduxjs/toolkit";

const userInitialState = {
  adminProfile: null,
  adminToken: null,
};

const fleetInitialState = {
  companyFleet: null,
};

const userReducer = (state = userInitialState, action: any) => {
  switch (action?.type) {
    case "SET_AUTH_TOKEN":
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.ADMIN_TOKEN_KEY,
        action.payload.token
      );
      return { ...state, adminToken: action.payload.token };
    case "SET_USER_PROFILE":
      return { ...state, adminProfile: action.payload.profile };
    default:
      return state;
  }
};

const fleetReducer = (state = fleetInitialState, action: any) => {
  switch (action?.type) {
    case "SET_COMPANY":
      return { ...state, companyFleet: action.payload.companyFleet };
    case "CLEAR_FLEET":
      return fleetInitialState;
    default:
      return state;
  }
};

const reducers = combineReducers({
  user: userReducer,
  fleet: fleetReducer,
});
export default reducers;
