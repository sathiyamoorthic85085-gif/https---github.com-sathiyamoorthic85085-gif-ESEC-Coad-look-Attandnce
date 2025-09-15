"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<User | null>;
    logout: () => void;
    users: User[];
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
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser && firebaseUser.email) {
                 // Find the user from mock data that matches the authenticated user's email
                const matchedUser = mockUsers.find(u => u.email.toLowerCase() === firebaseUser.email!.toLowerCase());
                setUser(matchedUser || null);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);


     useEffect(() => {
        if (!isLoading && !user && !['/login', '/register', '/splash', '/'].includes(pathname)) {
            router.push('/login');
        }
     }, [isLoading, user, pathname, router]);

    const login = async (email: string, password?: string): Promise<User | null> => {
        if (!password) {
            // This might be a session restoration case, handled by onAuthStateChanged
            const matchedUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (matchedUser) {
                setUser(matchedUser);
                return matchedUser;
            }
            return null;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            if (firebaseUser.email) {
                const matchedUser = mockUsers.find(u => u.email.toLowerCase() === firebaseUser.email!.toLowerCase());
                if (matchedUser) {
                    setUser(matchedUser);
                    return matchedUser;
                }
            }
            return null;
        } catch (error) {
            console.error("Firebase login error:", error);
            return null;
        }
    };


    const logout = async () => {
        await signOut(auth);
        setUser(null);
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
