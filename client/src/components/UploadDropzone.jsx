import React, { useCallback, useState, useRef } from 'react';
import { Upload, ImageIcon, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadDropzone = ({ onFileSelect, loading, file }) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    // Update preview when file prop changes (in case parent clears it)
    React.useEffect(() => {
        if (!file) {
            setPreview(null);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    }, [file]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        if (!selectedFile.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        onFileSelect(selectedFile);
    };

    const clearFile = (e) => {
        e.stopPropagation();
        onFileSelect(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <motion.div 
            whileHover={{ scale: preview ? 1 : 1.02 }}
            className="w-full relative"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-cyan rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            
            <div 
                className={`relative rounded-3xl p-8 transition-all duration-500 flex flex-col items-center justify-center min-h-[300px] cursor-pointer overflow-hidden backdrop-blur-xl border border-white/10
                    ${dragActive ? 'bg-brand-cyan/20 scale-[1.02] shadow-[0_0_40px_rgba(34,211,238,0.3)]' : 'bg-black/40 hover:bg-black/60 shadow-2xl'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !preview && inputRef.current?.click()}
            >
                <input 
                    ref={inputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleChange}
                    className="hidden" 
                    disabled={loading}
                />

                <AnimatePresence mode="wait">
                    {preview ? (
                        <motion.div 
                            key="preview"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full flex flex-col items-center gap-6 z-10"
                        >
                            <div className="relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
                                <img src={preview} alt="Upload preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                    <button 
                                        onClick={clearFile}
                                        disabled={loading}
                                        className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-transform hover:scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="text-center bg-black/50 px-6 py-3 rounded-full border border-white/5 backdrop-blur-md">
                                <p className="text-white font-medium text-sm truncate max-w-[200px]">{file?.name}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="upload-prompt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center text-center pointer-events-none z-10"
                        >
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="bg-gradient-to-br from-brand-purple/30 to-brand-cyan/30 p-6 rounded-[2rem] mb-6 shadow-inner border border-white/10"
                            >
                                <Upload className="w-12 h-12 text-brand-cyan drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Drag & drop your visual</h3>
                            <p className="text-gray-400 font-light mb-8 max-w-sm leading-relaxed">
                                Upload a photo of a place, a poster, or a document for intelligent analysis.
                            </p>
                            <div className="flex items-center gap-6 text-gray-500 text-sm font-medium">
                                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5"><ImageIcon className="w-4 h-4 text-brand-purple" /> JPEG, PNG</span>
                                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5"><FileText className="w-4 h-4 text-brand-cyan" /> WEBP</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default UploadDropzone;
