import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Save, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user, setUser } = useContext(AuthContext);
    const [needs, setNeeds] = useState(user?.accessibility_needs || '');
    const [language, setLanguage] = useState(user?.preferred_language || '');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setNeeds(user.accessibility_needs || '');
            setLanguage(user.preferred_language || '');
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/users/profile', {
                accessibility_needs: needs,
                preferred_language: language
            });
            setUser(res.data);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to update profile.');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto mt-10"
        >
            <div className="glass-panel p-10 rounded-[2.5rem]">
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-white/10">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-[1.5rem] flex items-center justify-center shadow-[0_0_20px_rgba(157,78,221,0.3)]">
                        <UserCircle className="w-12 h-12 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Your Profile</h2>
                        <p className="text-brand-cyan/80 mt-1">{user?.email}</p>
                    </div>
                </div>

                {message && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`p-4 rounded-2xl mb-8 font-medium border ${message.includes('success') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        {message}
                    </motion.div>
                )}

                <form onSubmit={handleSave} className="space-y-8">
                    <div>
                        <label className="block text-xl font-medium text-white mb-2 tracking-tight">Accessibility Needs</label>
                        <p className="text-sm text-gray-400 mb-4">Describe any cognitive, visual, or formatting needs (e.g., "Use simple language", "High contrast descriptions", "Dyslexic friendly formatting").</p>
                        <textarea 
                            rows={4}
                            value={needs}
                            onChange={(e) => setNeeds(e.target.value)}
                            placeholder="e.g., I prefer bullet points and short sentences..."
                            className="input-field resize-none leading-relaxed"
                        />
                    </div>

                    <div>
                        <label className="block text-xl font-medium text-white mb-2 tracking-tight">Preferred Language</label>
                        <p className="text-sm text-gray-400 mb-4">Which language should the AI use to communicate with you?</p>
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="input-field appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-brand-gray">Select a language (Default: English)</option>
                            <option value="English" className="bg-brand-gray">English</option>
                            <option value="Spanish" className="bg-brand-gray">Spanish</option>
                            <option value="French" className="bg-brand-gray">French</option>
                            <option value="German" className="bg-brand-gray">German</option>
                            <option value="Simple English" className="bg-brand-gray">Simple English</option>
                            <option value="Sign Language (Text Gloss)" className="bg-brand-gray">Sign Language (Text Gloss)</option>
                        </select>
                    </div>

                    <div className="pt-6">
                        <button type="submit" className="btn-primary w-full md:w-auto px-8">
                            <Save className="w-5 h-5" />
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default Dashboard;
