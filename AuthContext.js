import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext,useState,useEffect, Children, useDebugValue } from "react";
import {jwtDecode} from 'jwt-decode'

const AuthContext= createContext();

const AuthProvider = ({children}) =>{
    const [token,setToken] = useState("")
    const [userId,setUserId] = useState("")
    const [authUser,setAuthUser] = useState(
        AsyncStorage.getItem('authToken') || null
    );

    useEffect(()=>{
       const fetchUser = async () =>{
         const token = await AsyncStorage.getItem("authToken")
         const decodedToken = jwtDecode(token)
         const userId = decodedToken.userId
         setUserId(userId)
         setToken(token)
       }

       fetchUser();
    },[])

    return(
        <AuthContext.Provider value={{setAuthUser,authUser,token,userId,setToken,setUserId}}>
            {children}
        </AuthContext.Provider>
    )
};

export {AuthContext,AuthProvider}