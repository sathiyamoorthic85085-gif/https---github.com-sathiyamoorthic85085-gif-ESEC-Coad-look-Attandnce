
"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (details: Omit<User, 'id' | 'passwordHash' | 'imageUrl' | 'classId' | 'rollNumber' | 'registerNumber' | 'mobileNumber'> & { password: string }) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
       const response = await fetch('/api/auth/login', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email, password })
       });

       if (response.ok) {
           const { user: loggedInUser } = await response.json();
           setUser(loggedInUser);
           localStorage.setItem('user', JSON.stringify(loggedInUser));
           window.location.href = '/dashboard';
           return true;
       }
       return false;
    }

    const register = async (details: Omit<User, 'id' | 'passwordHash' | 'imageUrl'> & { password: string }): Promise<boolean> => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details)
        });
        
        return response.ok;
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/login';
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
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
