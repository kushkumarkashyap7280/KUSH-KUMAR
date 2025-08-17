import { createContext, useReducer, useContext, useEffect } from "react";
import * as api from  "../apis/admin"; // your axios methods

const AdminContext = createContext();

const initialState = {
  user: null,
  loading: true,
  showLogin: false, // for secret shortcut
};

function adminReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, loading: false };
    case "LOGOUT":
      return { ...state, user: null, loading: false };
    case "TOGGLE_LOGIN":
      return { ...state, showLogin: !state.showLogin };
    case "LOADING":
      return { ...state, loading: true };
    default:
      return state;
  }
}

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // wrapper methods that call API and dispatch
  const login = async (creds) => {
    try {
      const res = await api.adminLogin({
        email: (creds?.email || "").trim(),
        password: creds?.password || "",
      });
      dispatch({ type: "SET_USER", payload: res.data.data.admin });
      
    } catch (err) {
      // rethrow a concise error so the UI can show feedback
      const message = err?.response?.data?.message || "Login failed";
      throw new Error(message);
    }
  };

  const logout = async () => {
    await api.adminLogout();
    dispatch({ type: "LOGOUT" });
  };

  const signup = async (formData) => {
    const res = await api.adminSignup(formData);
    dispatch({ type: "SET_USER", payload: res.data.data.admin });
  };

  const update = async (payload, config = {}) => {
    const res = await api.adminUpdate(payload, config);
    dispatch({ type: "SET_USER", payload: res.data.data.admin });
  };

  const checkLogin = async () => {
    try {
      const res = await api.ifAdminLoggedIn();
      dispatch({ type: "SET_USER", payload: res.data.data.admin });
    } catch {
      dispatch({ type: "LOGOUT" });
    }
  };

  // check login status once on mount
  useEffect(() => {
    checkLogin();
  }, []);

  // hidden shortcut (Ctrl + Shift + K)
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "k") {
        dispatch({ type: "TOGGLE_LOGIN" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);


  return (
    <AdminContext.Provider
      value={{
        ...state,
        login,
        logout,
        signup,
        update,
        checkLogin,
        dispatch,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
