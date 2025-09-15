"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (identifier: string, password?: string) => Promise<User | null>;
    logout: () => void;
    setUser: (user: User | null) => void;
    users: User[];
    addUser: (user: User) => void;
    removeUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedUser = localStorage.getItem('chromagrade_user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

     useEffect(() => {
        if (!isLoading && !user && pathname !== '/login' && pathname !== '/register' && pathname !== '/splash' && pathname !== '/') {
            router.push('/login');
        }
     }, [isLoading, user, pathname, router]);

    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            localStorage.setItem('chromagrade_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('chromagrade_user');
        }
    };

    const login = async (identifier: string, password?: string): Promise<User | null> => {
        let foundUser: User | undefined;

        if(identifier === 'sathiyamoorthi.c85085@gmail.com' && password === 'pasworad1234567890') {
             foundUser = users.find(u => u.email === identifier);
        } else {
             foundUser = users.find(u => 
                (u.email.toLowerCase() === identifier.toLowerCase() || u.rollNumber?.toLowerCase() === identifier.toLowerCase()) &&
                (u.role === 'Student' ? u.rollNumber === password : true)
            );
        }

        if (foundUser) {
            setUser(foundUser);
            return foundUser;
        }
        return null;
    };

    const logout = () => {
        setUser(null);
        router.push('/login');
    };

    const addUser = (newUser: User) => {
        setUsers(prev => [...prev, newUser]);
    };
    
    const removeUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const value = { user, isLoading, login, logout, setUser, users, addUser, removeUser };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <p>Loading application...</p>
            </div>
        )
    }

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
