import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export type Address = {
  id: number;
  area: string;
  residential: string;
  street: string;
  building: number | string;
  other: string;
};
interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address: Address[];
  type: string;
  authUser: boolean;
}

// Define the interface for the auth state
interface AuthState {
  user: User;
  count: number;
  isAuthModal: boolean;
  access: boolean;
  openOrder: boolean;
}

// Helper function to safely parse JSON
const safeJSONParse = (json: string | null): User | null => {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to parse user data from localStorage:", e);
    return null;
  }
};

// Get the initial user state
const getInitialUser = (): User => {
  const storedUser = safeJSONParse(localStorage.getItem("authUser"));
  return (
    storedUser || {
      id: 0,
      first_name: "",
      last_name: "",
      phone: "",
      address: [],
      type: "",
      authUser: false,
    }
  );
};
const getInitialAddressIdCounter = (): number => {
  const storedCounter = localStorage.getItem("addressIdCounter");
  return storedCounter ? parseInt(storedCounter, 10) : 0;
};
const getInitialStuck = (): boolean => {
  const storedStuck = localStorage.getItem("stuck");
  return storedStuck ? JSON.parse(storedStuck) : false;
};

// Define the initial state with the correct type
const initialState: AuthState = {
  user: getInitialUser(),
  count: getInitialAddressIdCounter(),
  isAuthModal: false,
  access: getInitialStuck(),
  openOrder: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      const userId = action.payload;
      state.user = userId;
      state.user.authUser = true;

      localStorage.setItem("authUser", JSON.stringify(action.payload));
    },
    storeAddress(state, action) {
      const newState = {
        ...state.user,
        address: Array.isArray(state.user.address)
          ? [
              ...state.user.address,
              {
                id: state.count,
                area: action.payload.area,
                neighbourhood: action.payload.neighbourhood,
                street: action.payload.street,
                floor: action.payload.floor,
                other: action.payload.other,
              },
            ]
          : [action.payload],
      };

      state.count += 1;
      localStorage.setItem("authUser", JSON.stringify(newState));
      localStorage.setItem("addressIdCounter", JSON.stringify(state.count));
    },
    removeAddress(state, action) {
      const deletedAddress = state.user.address.filter(
        (add) =>
          add.area !== action.payload.area &&
          add.street !== action.payload.street &&
          add.building !== action.payload.floor
      );
      const newState = {
        ...state.user,
        address: Array.isArray(state.user.address)
          ? deletedAddress
          : [action.payload],
      };
      localStorage.setItem("authUser", JSON.stringify(newState));
    },
    logoutUser(state) {
      state.user = {
        id: 0,
        first_name: "",
        last_name: "",
        phone: "",
        type: "",
        address: state.user.address,
        authUser: false,
      };
      toast.info("logged out");

      localStorage.clear();
    },
    triggerAuthModal(state, action) {
      state.isAuthModal = action.payload;
    },
    changeAccess(state, action) {
      state.access = action.payload;
      localStorage.setItem("stuck", JSON.stringify(action.payload));
    },
    changeOpenOrder(state, action) {
      state.openOrder = action.payload;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  storeAddress,
  removeAddress,
  triggerAuthModal,
  changeAccess,
  changeOpenOrder,
} = authSlice.actions;
export default authSlice.reducer;
