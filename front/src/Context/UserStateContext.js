import { createContext, useReducer } from 'react';
import LoginReducer from "./LoginReducer";

export const UserStateContext = createContext(null);
export const UserDispatchContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(LoginReducer, {user : null})

  return (
    <UserStateContext.Provider value={userState}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}