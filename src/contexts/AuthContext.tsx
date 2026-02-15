import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AuthContextType {
    currentUser: User | null;
    isAdmin: boolean;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

// Check if we're in mock auth mode
const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Mock user object for testing
const createMockUser = (): Partial<User> => ({
    uid: 'mock-user-123',
    email: 'test@example.com',
    displayName: 'Test User (தேவ பயனர்)',
    photoURL: 'https://via.placeholder.com/150',
    emailVerified: true,
} as User);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const signInWithGoogle = async () => {
        if (useMockAuth) {
            console.log('🔧 Mock Auth: Signing in with dummy user');
            setCurrentUser(createMockUser() as User);
            localStorage.setItem('mockAuthUser', 'true');
            return;
        }

        try {
            // Use signInWithPopup for ALL devices (desktop + mobile)
            // Modern mobile browsers support popups when triggered by user gesture
            console.log('🔐 Auth: Signing in with Google popup');
            await signInWithPopup(auth, googleProvider);
        } catch (error: unknown) {
            const firebaseError = error as { code?: string };
            // Handle popup blocked - common on some mobile browsers
            if (firebaseError.code === 'auth/popup-blocked' || firebaseError.code === 'auth/popup-closed-by-user') {
                console.warn('⚠️ Auth: Popup was blocked or closed. Please allow popups for this site.');
            }
            console.error('Error signing in with Google:', error);
            throw error;
        }
    };

    const signOut = async () => {
        if (useMockAuth) {
            console.log('🔧 Mock Auth: Signing out');
            setCurrentUser(null);
            localStorage.removeItem('mockAuthUser');
            return;
        }

        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (useMockAuth) {
            const wasMockLoggedIn = localStorage.getItem('mockAuthUser') === 'true';
            if (wasMockLoggedIn) {
                setCurrentUser(createMockUser() as User);
            }
            setLoading(false);
            console.log('🔧 Mock Auth Mode Enabled - No Firebase required');
            return;
        }

        // Real Firebase auth - simple and reliable
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('👤 Auth state:', user ? user.email : 'Not logged in');
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        isAdmin: currentUser?.email === 'kwaheedsays@gmail.com',
        loading,
        signInWithGoogle,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
