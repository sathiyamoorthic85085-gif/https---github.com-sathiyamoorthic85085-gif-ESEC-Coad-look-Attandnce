"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<User | null>;
    logout: () => void;
    users: User[];
    setUser: (user: User | null) => void;
    addUser: (user: User) => void;
    removeUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    
     useEffect(() => {
        // Simulate loading user from a session
        try {
            const sessionUserEmail = sessionStorage.getItem('user_email');
            if (sessionUserEmail) {
                const matchedUser = users.find(u => u.email.toLowerCase() === sessionUserEmail.toLowerCase());
                setUser(matchedUser || null);
            }
        } catch (e) {
            console.error("Could not access session storage.");
        } finally {
            setIsLoading(false);
        }
    }, [users]);


     useEffect(() => {
        if (!isLoading && !user && !['/login', '/register', '/splash', '/'].includes(pathname)) {
            router.push('/login');
        }
     }, [isLoading, user, pathname, router]);

    const login = async (email: string, password?: string): Promise<User | null> => {
        const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        // In a mock setup, we can check for a password if provided, or just log in.
        if (matchedUser && (!password || matchedUser.password === password)) {
            setUser(matchedUser);
             try {
                sessionStorage.setItem('user_email', matchedUser.email);
            } catch (e) {
                console.error("Could not access session storage.");
            }
            return matchedUser;
        }

        return null;
    };


    const logout = async () => {
        setUser(null);
        try {
            sessionStorage.removeItem('user_email');
        } catch (e) {
             console.error("Could not access session storage.");
        }
        router.push('/login');
    };

    const addUser = (newUser: User) => {
        setUsers(prev => [...prev, newUser]);
        // Also update mockUsers so it's reflected across sessions if needed for mock purposes
        if(!mockUsers.find(u => u.id === newUser.id)) {
            mockUsers.push(newUser);
        }
    };
    
    const removeUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const value = { user, setUser, isLoading, login, logout, users, addUser, removeUser };

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
