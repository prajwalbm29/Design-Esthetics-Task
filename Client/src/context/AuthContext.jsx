import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: '',
        isAdmin: false,
    });

    // Set axios defaults
    axios.defaults.baseURL = "http://localhost:8080";

    // Initialize auth state from localStorage
    const initializeAuth = () => {
        const data = localStorage.getItem("auth");
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setAuth({
                    user: parsedData?.user || null,
                    token: parsedData?.token || '',
                    isAdmin: parsedData?.user?.isAdmin || false,
                });
                axios.defaults.headers.common['Authorization'] = parsedData?.token;
            } catch (error) {
                console.error("Failed to parse auth data:", error);
                localStorage.removeItem("auth");
            }
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };
    useEffect(() => {
        initializeAuth();
    }, []);

    // Login function
    const login = async (formData) => {
        try {
            const { data } = await axios.post("/api/v1/auth/login", formData);
            if (data?.success) {
                const { user, token } = data;
                const authData = {
                    user,
                    token,
                    isAdmin: user.isAdmin || false,
                };
                localStorage.setItem("auth", JSON.stringify(authData));
                setAuth(authData);
                axios.defaults.headers.common['Authorization'] = token;
                toast.success(data?.message);
                return true;
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            const { data } = await axios.post("/api/v1/auth/register", userData);
            if (data?.success) {
                toast.success(data?.message);
                return true;
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.response?.data?.message || "Registration failed");
            return false;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("auth");
        setAuth({
            user: null,
            token: '',
            isAdmin: false,
        });
        delete axios.defaults.headers.common['Authorization'];
        toast.success("Logged out successfully");
        return true;
    };

    // Check if user is authenticated
    const isAuthenticated = async () => {
        if (!auth.token) return false;
        try {
            const { data } = await axios.get("/api/v1/auth/verify-login");
            if (data?.success) {
                return true;
            }
            return false;
        } catch (error) {
            console.log("Error in authentication in context", error);
            return false;
        }
    };

    // Check if user is admin
    const isAdmin = async () => {
        if (!auth.isAdmin) return false;
        try {
            const { data } = await axios.get("/api/v1/auth/verify-admin");
            if (data?.success) {
                return true;
            }
            return false;
        } catch (error) {
            console.log("Error in authentication in context", error);
            return false;
        }
    };

    const updateAuth = (user) => {
        const authData = {
            user,
            token: auth.token,
            isAdmin: auth.isAdmin
        }
        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                login,
                register,
                logout,
                isAuthenticated,
                isAdmin,
                setAuth,
                updateAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};