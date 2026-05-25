import { createContext, useContext } from "react";
import { useAdminSocket } from "../hooks/useAdminSocket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useAdminSocket();
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx)
    throw new Error("useSocket doit être utilisé dans un <SocketProvider>");
  return ctx;
};
