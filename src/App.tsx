import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LearningModule from './components/LearningModule';
import './index.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return currentUser ? <>{children}</> : <Navigate to="/" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return currentUser ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicRoute>
                        <Landing />
                    </PublicRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/learn/:dayNumber"
                element={
                    <ProtectedRoute>
                        <LearningModule />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
