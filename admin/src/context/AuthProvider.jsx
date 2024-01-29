import React, { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  token: localStorage.getItem("token"),
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { isAuthenticated: true, token: action.payload.token };
    case "LOGOUT":
      return { isAuthenticated: false, token: null };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (token) => {
    dispatch({ type: "LOGIN", payload: { token } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
