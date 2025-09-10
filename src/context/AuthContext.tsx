"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    setUser: (user: User | null) => void; // Keep for mock purposes if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = (email: string, password: string): boolean => {
        const foundUser = mockUsers.find(u => u.email === email);

        if (foundUser) {
            const isPasswordCorrect = foundUser.role === 'Student'
                ? password === foundUser.rollNumber
                : password === foundUser.password;

            if (isPasswordCorrect) {
                setUser(foundUser);
                return true;
            }
        }
        return false;
    }

    const logout = () => {
        setUser(null);
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
