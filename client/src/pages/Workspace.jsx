import React, { useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import UploadDropzone from '../components/UploadDropzone';
import ResultViewer from '../components/ResultViewer';

const Workspace = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [file, setFile] = useState(null);
    const [customText, setCustomText] = useState('');

    const handleAnalyze = async () => {
        if (!file) {
            alert('Please select an image first.');
            return;
        }

        setLoading(true);
        setResult(null);
        
        try {
            const formData = new FormData();
            formData.append('image', file);
            if (customText.trim()) {
                formData.append('customText', customText);
            }

            const res = await api.post('/ai/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setResult(res.data);
        } catch (error) {
            console.error('Upload Error:', error);
            alert(error.response?.data?.error || 'Failed to analyze the image.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setFile(null);
        setCustomText('');
    };

    return (
        <div className="relative min-h-[80vh]">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div 
                    animate={{ 
                        x: [0, 100, -100, 0],
                        y: [0, -100, 100, 0],
                        scale: [1, 1.2, 0.8, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[100px]"
                />
                <motion.div 
                    animate={{ 
                        x: [0, -150, 100, 0],
                        y: [0, 100, -100, 0],
                        scale: [1, 0.8, 1.3, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-brand-cyan/20 rounded-full blur-[120px]"
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-5xl mx-auto flex flex-col py-12 px-4"
            >
                <div className="text-center mb-16 relative">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-2xl backdrop-blur-md"
                    >
                        <Sparkles className="w-8 h-8 text-brand-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    </motion.div>
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tighter drop-shadow-sm">
                        AccessAI Workspace
                    </h1>
                    <p className="text-gray-400 font-light text-xl max-w-2xl mx-auto leading-relaxed">
                        Upload a visual, ask a question, and let our AI provide a simplified, highly accessible description tailored just for you.
                    </p>
                </div>

                <div className="flex-grow w-full relative z-10">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            >
                                <div className="h-full">
                                    <UploadDropzone onFileSelect={setFile} file={file} loading={loading} />
                                </div>
                                
                                <div className="flex flex-col h-full space-y-6">
                                    <div className="flex-grow relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10 bg-black/40 p-8 shadow-2xl transition-all focus-within:border-brand-purple/50 focus-within:shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-brand-purple/20 rounded-lg border border-brand-purple/30">
                                                <MessageSquare className="w-5 h-5 text-brand-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white tracking-tight">Additional Context</h3>
                                        </div>
                                        <textarea
                                            value={customText}
                                            onChange={(e) => setCustomText(e.target.value)}
                                            disabled={loading}
                                            placeholder="E.g., 'What are the main bullet points?' or 'Explain the left side of this image...'"
                                            className="w-full h-[65%] bg-transparent border-none outline-none text-gray-200 text-lg font-light resize-none placeholder:text-gray-600 disabled:opacity-50"
                                        />
                                    </div>

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={loading || !file}
                                        className="relative w-full overflow-hidden group rounded-2xl p-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-purple bg-[length:200%_auto] animate-shimmer rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity"></span>
                                        <div className="relative flex items-center justify-center gap-3 bg-black px-8 py-5 rounded-2xl transition-all duration-300 group-hover:bg-black/80">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 text-brand-cyan animate-spin" />
                                                    <span className="text-xl font-bold text-white tracking-wide">Processing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-6 h-6 text-brand-cyan group-hover:scale-110 transition-transform" />
                                                    <span className="text-xl font-bold text-white tracking-wide">Analyze Interaction</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -30, scale: 0.98 }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="space-y-10"
                            >
                                <ResultViewer result={result} userPrompt={customText} />
                                
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex justify-center mt-12"
                                >
                                    <button
                                        onClick={handleReset}
                                        className="relative group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-semibold tracking-wide transition-all duration-300 shadow-xl overflow-hidden"
                                    >
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                                        Analyze Another
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Workspace;
