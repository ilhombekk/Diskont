import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        });
        
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        setUser(response.data.user);
        
        return response.data.user;
    };
    
    const register = async (name, email, password) => {
        const response = await api.post("/auth/register", {
            name,
            email,
            password,
        });
        
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        setUser(response.data.user);
        
        return response.data.user;
    };
    
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        setUser(null);
    };
    
    const isAdmin = user?.role === "admin";
    
    return (
        <AuthContext.Provider
        value={{
            user,
            login,
            register,
            logout,
            isAdmin,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}