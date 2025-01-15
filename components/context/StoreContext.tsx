"use client";

import axios from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";

interface UserData {
  _id:string;
  email: string;
  name?: string;
  roles:[string]; // Add other properties as needed
}

interface StoreContextType {
  showY: boolean;
  setshowY: (show: boolean) => void;
  showLogin: boolean;
  setshowLogin: (show: boolean) => void;
  token: any;
  setToken: (token: string) => void;
  user_data: UserData | null;
  setuser_data: (data: UserData | null) => void;
  logOut: () => void;
}

export const StoreContext = createContext<StoreContextType | null>(null);

interface StoreContextProviderProps {
  children: ReactNode;
}

const StoreContextProvider = ({ children }: StoreContextProviderProps) => {
  const [showY, setshowY] = useState(false);
  const [showLogin, setshowLogin] = useState(false);
  const [user_data, setuser_data] = useState<UserData | null>(null);

  const initialToken =
    typeof window !== "undefined" && localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
  const [token, setToken] = useState(initialToken);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setuser_data(response.data.user_data);
      } else {
        console.log(response.data.message);
      }
      console.log("User Data:", response.data.user_data.email);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };
  const logOut = function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  const checkToken = async () => {
    try {
      const response = await axios.get("/api/user/data/checkToken", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setshowLogin(true);
        fetchUserData();
      } else {
        console.log(response.data.message);
        localStorage.removeItem("token");
        setToken("");
      }
    } catch (err) {
      console.error("Error during token validation:", err);
    }
  };

  useEffect(() => {
    if (token) checkToken();
  }, [token]);

  const contextValue: StoreContextType = {
    showY,
    setshowY,
    showLogin,
    setshowLogin,
    setToken,
    user_data,
    setuser_data,
    logOut,
    token,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
