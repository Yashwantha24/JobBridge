import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobDetails from './pages/JobDetails';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                <Toaster position="top-right" />
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/jobs/:id" element={<JobDetails />} />

                        <Route path="/student/dashboard" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/recruiter/dashboard" element={
                            <ProtectedRoute allowedRoles={['recruiter']}>
                                <RecruiterDashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
                <footer className="bg-gray-800 text-white text-center py-4">
                    <p>&copy; 2024 JobBridge. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
