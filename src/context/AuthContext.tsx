
"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';
import { useUser as useStackUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { user: stackUser, isLoading: isStackLoading } = useStackUser();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

     useEffect(() => {
        setIsLoading(isStackLoading);
        if (!isStackLoading) {
            if (stackUser) {
                const role = (stackUser.publicMetadata as any)?.role || 'Student'; // Default role
                const department = (stackUser.publicMetadata as any)?.department || 'N/A';
                const classId = (stackUser.publicMetadata as any)?.classId;
                const rollNumber = (stackUser.publicMetadata as any)?.rollNumber;

                const appUser: User = {
                    id: stackUser.id,
                    name: stackUser.displayName || stackUser.primaryIdentifier || 'User',
                    email: stackUser.primaryEmail?.email || '',
                    role: role,
                    department: department,
                    imageUrl: stackUser.avatarUrl || `https://picsum.photos/seed/${stackUser.id}/100/100`,
                    classId: classId,
                    rollNumber: rollNumber,
                };
                setUser(appUser);
            } else {
                setUser(null);
            }
        }
    }, [stackUser, isStackLoading]);


    const logout = () => {
        setUser(null);
        // Stack's logout is handled automatically when session ends.
        // For an explicit sign-out, you might need a Stack-specific function
        // This is a simple redirect for now.
        router.push('/login');
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, logout, setUser }}>
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
