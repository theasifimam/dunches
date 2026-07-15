'use client';
import { useAppSelector } from '@/store/store';
import { selectIsAuthenticated, selectCurrentUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export function AuthGuard({ children }) {
    return <>{children}</>;
}
