import { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client'
import { AuthContext } from "./AuthContext";
import { Message } from "./api/models/message";

const SocketContext = createContext()

export const useSocketContext = () => {
    return useContext(SocketContext)
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const { authUser, userId } = useContext(AuthContext)

    useEffect(() => {
        if (authUser) {
            const socket = io("http://192.168.1.4:3000", {
                query: {
                    userId: userId,
                }
            });
            setSocket(socket)

            return () => socket.close()
        } else {
            if (socket) {
                socket.close()
                setSocket(null)
            }
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            {children}
        </SocketContext.Provider>
    )
}

