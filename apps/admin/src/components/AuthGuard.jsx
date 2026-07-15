'use client';
import { useAppSelector } from '@/store/store';
import { selectIsAuthenticated, selectCurrentUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }) {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!isAuthenticated) {
            router.replace('/login');
        } else if (user && user.role !== 'admin' && user.role !== 'moderator') {
            router.replace('/login');
        }
    }, [mounted, isAuthenticated, user, router]);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated || (user && user.role !== 'admin' && user.role !== 'moderator')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
