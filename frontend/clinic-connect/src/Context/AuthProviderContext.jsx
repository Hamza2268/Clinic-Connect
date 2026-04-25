import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true while checking localStorage
  const [initialized, setInitialized] = useState(false);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedUserType = localStorage.getItem("userType");

    // Restore token even if `user` is missing to avoid accidental removal
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedUserType) {
      setUserType(storedUserType);
    }

    setLoading(false);
    setInitialized(true);
  }, []);

  // Set Axios Authorization header when token changes
  useEffect(() => {
    // don't modify storage during the initial restore phase
    if (!initialized) return;

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token, initialized]);

  // Persist user data when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Persist userType when it changes
  useEffect(() => {
    if (userType) {
      localStorage.setItem("userType", userType);
    } else {
      localStorage.removeItem("userType");
    }
  }, [userType]);

  // ------ LOGIN ------
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/v1/users/Login", {
        email,
        password,
      });

      setToken(data.token);
      setUser(data.user);
      setUserType(data.user.role);

      return { success: true, type: data.user.role };
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);

    try {
      const formData = new FormData();

      // Append all fields
      Object.keys(userData).forEach((key) => {
        if (key === "photo" && userData.photo) {
          formData.append("photo", userData.photo); // 👈 ONE picture
        } else {
          formData.append(key, userData[key]);
        }
      });

      const { data } = await axios.post("/api/v1/users/Signup", formData);

      setToken(data.token);
      setUser(data.user);
      setUserType(data.user.role);

      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append all fields
      Object.keys(userData).forEach((key) => {
        if (key === "photo" && userData.photo) {
          formData.append("photo", userData.photo); // 👈 ONE picture
        } else {
          formData.append(key, userData[key]);
        }
      });

      console.log("before post user data:", userData);
      const { data } = await axios.patch(
        "/api/v1/users/updatePersonalInfo",
        formData,
      );
      console.log("after post updated data:", data.user);

      setUser(data.user);
      setUserType(data.user.role);
      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.message || "update failed");
    } finally {
      setLoading(false);
    }
  };

  // ------ forget password ------
  const forgetPassword = async (email) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/v1/users/ForgotPassword", {
        email,
      });

      setUser(data.user);

      return { success: true };
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ------ LOGOUT ------
  const logout = () => {
    setToken(null);
    setUser(null);
    setUserType(null);
    // localStorage will be cleared by the useEffect hooks
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        userType,
        loading,
        login,
        signup,
        logout,
        isLoggedIn: !!token,
        forgetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
