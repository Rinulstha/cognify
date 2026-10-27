import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Define logout FIRST so other functions can use it
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    // Now checkAuthStatus can safely call logout
    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                const userData = JSON.parse(userStr);
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout(); // ✅ Now logout is already defined
        } finally {
            setLoading(false);
        }
    };

    // useEffect can call checkAuthStatus now
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);
    };

    const updateUser = (updatedUserData) => {
        const newUserData = { ...user, ...updatedUserData };
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        checkAuthStatus
    }; 

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};