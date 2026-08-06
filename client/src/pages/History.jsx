import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ResultViewer from '../components/ResultViewer';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Loader2 } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/ai/history');
                setHistory(res.data);
            } catch (error) {
                console.error('Failed to fetch history', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-brand-cyan animate-spin drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <p className="text-gray-400 font-medium animate-pulse">Loading history...</p>
            </div>
        );
    }

    if (selectedItem) {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <button 
                    onClick={() => setSelectedItem(null)}
                    className="mb-8 text-brand-cyan hover:text-white flex items-center gap-2 font-medium transition-colors"
                >
                    ← Back to History
                </button>
                <div className="bg-white/5 p-6 rounded-2xl mb-8 border border-white/10 backdrop-blur-sm">
                    <p className="text-gray-400 font-medium">Analyzed Image: <span className="text-white font-bold">{selectedItem.image_name}</span></p>
                    <p className="text-gray-500 text-sm mt-1">{new Date(selectedItem.created_at).toLocaleString()}</p>
                </div>
                <ResultViewer result={selectedItem.structured_data} userPrompt={selectedItem.user_prompt} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 relative">
            {/* Soft Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-12"
            >
                <div className="p-3 bg-brand-cyan/20 border border-brand-cyan/30 rounded-2xl shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                    <HistoryIcon className="w-8 h-8 text-brand-cyan" />
                </div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Your History</h1>
            </motion.div>

            {history.length === 0 ? (
                <div className="bg-black/30 backdrop-blur-md rounded-3xl p-12 text-center border border-white/10">
                    <p className="text-gray-400 text-lg">No analysis history found. Head to the Workspace to get started!</p>
                </div>
            ) : (
                <motion.div 
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {history.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200 } }
                            }}
                            whileHover={{ scale: 1.03, translateY: -5 }}
                            onClick={() => setSelectedItem(item)}
                            className="bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 hover:border-brand-cyan/50 p-6 rounded-3xl cursor-pointer transition-all duration-300 shadow-xl group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 group-hover:bg-brand-cyan group-hover:border-brand-cyan transition-colors">
                                        {item.category}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-white line-clamp-1 group-hover:text-brand-cyan transition-colors">{item.image_name}</h3>
                                {item.user_prompt && (
                                    <p className="text-gray-400 text-sm font-medium italic mb-3 line-clamp-1 flex gap-2 items-center">
                                        <span className="text-brand-purple">Q:</span> {item.user_prompt}
                                    </p>
                                )}
                                <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed mt-auto font-light">
                                    {item.simplified_description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default History;
