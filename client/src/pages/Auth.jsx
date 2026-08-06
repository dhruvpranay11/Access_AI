import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(email, password);
                navigate('/');
            } else {
                await register(email, password);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="min-h-[80vh] flex items-center justify-center pt-10"
        >
            <div className="glass-panel w-full max-w-md p-10 rounded-[2.5rem] relative overflow-hidden">
                {/* Decorative glow inside card */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-purple rounded-full blur-[80px] opacity-40 mix-blend-screen pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-cyan rounded-full blur-[80px] opacity-20 mix-blend-screen pointer-events-none"></div>
                
                <h2 className="text-4xl font-bold text-white mb-3 relative z-10 tracking-tight">
                    {isLogin ? 'Welcome back' : 'Join AccessAI'}
                </h2>
                <p className="text-gray-400 mb-10 relative z-10 font-light">
                    {isLogin ? 'Enter your details to access your workspace.' : 'Sign up to personalize your accessibility profile.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-medium">
                            {error}
                        </motion.div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full py-4 mt-4 shadow-[0_0_20px_rgba(157,78,221,0.2)]">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center relative z-10">
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="text-gray-400 hover:text-white font-medium text-sm transition-colors"
                    >
                        {isLogin ? (
                            <span>New here? <span className="text-brand-cyan">Sign up</span></span>
                        ) : (
                            <span>Already have an account? <span className="text-brand-cyan">Sign in</span></span>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Auth;
