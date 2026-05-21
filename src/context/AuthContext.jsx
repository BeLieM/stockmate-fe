"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const performLogout = () => {
        Cookies.remove("stockmate_token", { path: "/" });
        Cookies.remove("stockmate_user_id", { path: "/" });
        setIsAuthenticated(false);
        
        // Menggunakan Hard Redirect untuk memastikan sesi benar-benar bersih di browser
        window.location.href = "/";
    };

    useEffect(() => {
        const token = Cookies.get("stockmate_token");
        const isAuthPage = pathname === "/" || pathname === "/register" || pathname === "/forgot-password";

        if (!token) {
            setIsAuthenticated(false);
            if (!isAuthPage) {
                router.replace("/");
            } else {
                setIsChecking(false);
            }
        } else {
            setIsAuthenticated(true);
            if (isAuthPage) {
                router.replace("/home");
            } else {
                setIsChecking(false);
            }
        }
    }, [pathname, router]);

    useEffect(() => {
        const originalFetch = window.fetch;

        window.fetch = async (...args) => {
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath === "/" || currentPath === "/register" || currentPath === "/forgot-password";

            try {
                const response = await originalFetch(...args);
                
                // Kasus 1: Session Expired (Unauthorized)
                if (response.status === 401 && !isAuthPage) {
                    performLogout();
                }
                return response;
            } catch (error) {
                const targetUrl = args[0] instanceof Request ? args[0].url : args[0];
                const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

                // Kasus 2: Server Mati (TypeError / Failed to fetch)
                if (API_URL && targetUrl && targetUrl.includes(API_URL) && !isAuthPage) {
                    performLogout();
                }
                throw error;
            }
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, performLogout, isChecking }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);