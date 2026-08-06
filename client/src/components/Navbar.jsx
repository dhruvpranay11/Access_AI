import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, LayoutDashboard, History as HistoryIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLink = (path, name, Icon) => {
        const isActive = location.pathname === path;
        return (
            <Link to={path} className="relative group px-3 py-2 flex items-center gap-2">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-cyan' : 'text-gray-400 group-hover:text-white'}`} />
                <span className={`font-medium text-sm transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {name}
                </span>
                {isActive && (
                    <motion.div 
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </Link>
        );
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center"
        >
            <div className="glass-panel rounded-2xl h-16 flex items-center justify-between w-full max-w-5xl px-6">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="p-2 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-xl group-hover:shadow-[0_0_20px_rgba(157,78,221,0.5)] transition-shadow">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">
                        AccessAI
                    </span>
                </Link>

                <div className="flex items-center gap-2 md:gap-6">
                    {user ? (
                        <>
                            {navLink('/workspace', 'Workspace', Sparkles)}
                            {navLink('/history', 'History', HistoryIcon)}
                            {navLink('/dashboard', 'Profile', LayoutDashboard)}
                            
                            <div className="w-px h-6 bg-white/10 mx-2 hidden md:block"></div>
                            
                            <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors ml-2 px-3 py-2 rounded-lg hover:bg-red-500/10">
                                <LogOut className="w-4 h-4" /> 
                                <span className="hidden md:inline text-sm">Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/auth" className="btn-primary py-2 px-5 text-sm">
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
