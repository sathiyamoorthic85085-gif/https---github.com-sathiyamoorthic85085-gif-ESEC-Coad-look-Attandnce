"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password?: string) => User | null;
    logout: () => void;
    users: User[];
    addUser: (user: User) => void;
    removeUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to manage a mock session
const getSession = (): User | null => {
    try {
        const session = sessionStorage.getItem('chromagrade-user');
        return session ? JSON.parse(session) : null;
    } catch (error) {
        return null;
    }
};

const setSession = (user: User | null) => {
    if (user) {
        sessionStorage.setItem('chromagrade-user', JSON.stringify(user));
    } else {
        sessionStorage.removeItem('chromagrade-user');
    }
};


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        const sessionUser = getSession();
        if (sessionUser) {
            // Re-validate user from our mock list in case data changed
            const liveUser = mockUsers.find(u => u.id === sessionUser.id);
            setUser(liveUser || null);
        }
        setIsLoading(false);
    }, []);

     useEffect(() => {
        if (!isLoading && !user && !['/login', '/register', '/splash', '/'].includes(pathname)) {
            router.push('/login');
        }
     }, [isLoading, user, pathname, router]);

    const login = (email: string, password?: string): User | null => {
        // Find the user from mock data that matches the authenticated user's email
        const matchedUser = mockUsers.find(u => 
            u.email.toLowerCase() === email.toLowerCase() &&
            (password ? u.password === password : true) // Simple check, bypass for session restore
        );
        if (matchedUser) {
            setUser(matchedUser);
            setSession(matchedUser);
            return matchedUser;
        }
        return null;
    };


    const logout = () => {
        setUser(null);
        setSession(null);
        router.push('/login');
    };

    const addUser = (newUser: User) => {
        setUsers(prev => [...prev, newUser]);
    };
    
    const removeUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const value = { user, isLoading, login, logout, users, addUser, removeUser };

    return (
        <AuthContext.Provider value={value}>
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
