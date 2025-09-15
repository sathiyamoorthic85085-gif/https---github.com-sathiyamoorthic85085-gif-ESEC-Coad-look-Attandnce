
"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, UserRole } from '@/lib/types';
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
    // const { user: stackUser, isLoading: isStackLoading } = useStackUser();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

     useEffect(() => {
        // To test different dashboards, change the role value below.
        // Available roles: 'Admin', 'HOD', 'Faculty', 'Student', 'Advisor'
        const role: UserRole = 'Admin'; 

        const mockUser: User = {
            id: 'dev-user',
            name: `${role} User`,
            email: `${role.toLowerCase()}@example.com`,
            role: role,
            department: 'Development',
            imageUrl: `https://picsum.photos/seed/dev-user/100/100`,
            classId: 'CLS01',
            rollNumber: 'DEV001',
        };

        setUser(mockUser);
        setIsLoading(false);
    }, []);


    const logout = () => {
        setUser(null);
        // In a real scenario, you'd also sign out from Stack
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
