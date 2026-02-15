import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import LearningModule from './components/LearningModule';
import QuizPage from './components/QuizPage';
import MulkChallenge from './pages/MulkChallenge';
import GlobalBismillah from './components/GlobalBismillah';
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

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { currentUser, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return currentUser && isAdmin ? <>{children}</> : <Navigate to="/dashboard" />;
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
            <Route
                path="/quiz/:dayNumber"
                element={
                    <ProtectedRoute>
                        <QuizPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mulk-challenge/:dayNumber"
                element={
                    <ProtectedRoute>
                        <MulkChallenge />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />
        </Routes>
    );
}

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <GlobalBismillah />
                        <AppRoutes />
                    </BrowserRouter>
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
