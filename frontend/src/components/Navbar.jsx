import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiBriefcase } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                            <HiBriefcase size={24} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                            JobBridge
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Find Jobs</Link>
                        {user ? (
                            <>
                                {user.role === 'student' && (
                                    <Link to="/student/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Dashboard</Link>
                                )}
                                {user.role === 'recruiter' && (
                                    <Link to="/recruiter/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Dashboard</Link>
                                )}
                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                                    <span className="text-sm text-gray-500">Hi, {user.name}</span>
                                    <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button>Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium" onClick={() => setIsOpen(false)}>Find Jobs</Link>
                            {user ? (
                                <>
                                    {user.role === 'student' && (
                                        <Link to="/student/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                    )}
                                    {user.role === 'recruiter' && (
                                        <Link to="/recruiter/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                    )}
                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{user.name}</span>
                                        <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-center">Login</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full justify-center">Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
