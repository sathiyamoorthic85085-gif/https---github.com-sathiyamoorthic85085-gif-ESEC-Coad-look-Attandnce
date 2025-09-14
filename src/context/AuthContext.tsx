
"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User | null) => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // This is a mock authentication for demonstration purposes.
        // In a real application, you would validate a session token.
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Mock login as the first admin user for demo purposes
            const adminUser = mockUsers.find(u => u.role === 'Admin');
            if (adminUser) {
                setUser(adminUser);
                localStorage.setItem('user', JSON.stringify(adminUser));
                document.cookie = `user=${JSON.stringify(adminUser)}; path=/; max-age=86400;`;
            }
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // This function is a placeholder.
        // The actual login should be handled by your external auth provider's SDK.
        console.warn("Login function is a placeholder. Integrate your auth provider.");
        const foundUser = mockUsers.find(u => u.email === email);
        if(foundUser) {
            setUser(foundUser);
            localStorage.setItem('user', JSON.stringify(foundUser));
            document.cookie = `user=${JSON.stringify(foundUser)}; path=/; max-age=86400;`;
            return true;
        }
        return false;
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/login';
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
