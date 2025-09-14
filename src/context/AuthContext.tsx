"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data'; // Use mock data for login

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Persist user state on reload
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Use mock data for authentication
        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser) {
            // For students, password is the roll number. For others, it's a password.
            const isPasswordCorrect = foundUser.role === 'Student'
                ? password === foundUser.rollNumber
                : password === 'password123'; // Using a generic password for mock staff

            if (isPasswordCorrect) {
                setUser(foundUser);
                localStorage.setItem('user', JSON.stringify(foundUser)); // Save to local storage
                return true;
            }
        }
        return false;
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Clear from local storage
        // You might want to redirect to login page here
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
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
