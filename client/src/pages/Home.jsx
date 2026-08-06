import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Hero3D } from '../components/Hero3D';

const Home = () => {
    const { user } = useContext(AuthContext);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };
    
    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            variants={containerVariants}
            className="min-h-[85vh] flex flex-col items-center justify-center text-center pb-20 relative overflow-hidden"
        >
            <Hero3D />

            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-brand-cyan font-medium text-sm mb-8 shadow-[0_0_15px_rgba(0,245,212,0.1)] backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                Empowering Digital Inclusion
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl leading-tight drop-shadow-lg">
                Break down barriers with <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-purple to-indigo-500 animate-pulse">
                    AccessAI
                </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-300 mb-12 max-w-2xl font-light drop-shadow-md">
                An AI-powered tool that adapts digital content in real-time to match your unique accessibility needs and language preferences.
            </motion.p>

            <motion.div variants={itemVariants}>
                <Link to={user ? "/workspace" : "/auth"} className="btn-primary text-lg px-10 py-4 shadow-[0_0_30px_rgba(157,78,221,0.5)] hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                    <span className="relative z-10 flex items-center gap-2">
                        {user ? "Go to Workspace" : "Start Using AccessAI"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
            </motion.div>

            <motion.div variants={containerVariants} className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl z-10">
                {[
                    { icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10", title: "Cognitive Simplification", desc: "Complex texts transformed into clear, easily understandable language." },
                    { icon: Sparkles, color: "text-brand-purple", bg: "bg-brand-purple/10", title: "Visual Descriptions", desc: "Rich, detailed screen-reader friendly descriptions for visual content." },
                    { icon: Shield, color: "text-brand-cyan", bg: "bg-brand-cyan/10", title: "Secure & Private", desc: "Your profile and interactions are saved securely for your eyes only." }
                ].map((feature, i) => (
                    <motion.div key={i} variants={itemVariants} className="glass-card p-8 rounded-3xl flex flex-col items-center text-center group backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl hover:shadow-[0_0_40px_rgba(157,78,221,0.2)]">
                        <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                            <feature.icon className={`w-8 h-8 ${feature.color}`} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default Home;
