import React from 'react';
import { motion } from 'framer-motion';
import { Info, MapPin, FileText, Layout, MessageSquare } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const GlassCard = ({ children, className = "" }) => (
    <motion.div 
        variants={itemVariants}
        className={`bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-3xl p-8 relative overflow-hidden group ${className}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {children}
    </motion.div>
);

const ResultViewer = ({ result, userPrompt }) => {
    if (!result) return null;

    const renderCategorySpecific = () => {
        switch (result.category) {
            case 'place':
                return (
                    <>
                        {result.place_details?.places_to_cover && result.place_details.places_to_cover.length > 0 && (
                            <GlassCard>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
                                    <MapPin className="w-6 h-6 text-brand-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> 
                                    Places to Cover
                                </h3>
                                <ul className="space-y-3">
                                    {result.place_details.places_to_cover.map((place, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-300 font-light">
                                            <span className="text-brand-cyan shrink-0 mt-1">•</span> {place}
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        )}
                        {result.place_details?.climatic_changes && (
                            <GlassCard>
                                <h3 className="text-xl font-bold mb-4 text-white">Climatic Details</h3>
                                <p className="text-gray-300 font-light leading-relaxed">{result.place_details.climatic_changes}</p>
                            </GlassCard>
                        )}
                        {result.place_details?.directions_and_tips && (
                            <GlassCard className="md:col-span-2">
                                <h3 className="text-xl font-bold mb-4 text-white">Directions & Tips</h3>
                                <p className="text-gray-300 font-light leading-relaxed">{result.place_details.directions_and_tips}</p>
                            </GlassCard>
                        )}
                    </>
                );
            case 'poster':
                return (
                    <>
                        <GlassCard>
                            <h3 className="text-xl font-bold mb-4 text-white">Main Subject</h3>
                            <p className="text-gray-300 font-light leading-relaxed">{result.poster_details?.main_subject}</p>
                        </GlassCard>
                        <GlassCard>
                            <h3 className="text-xl font-bold mb-4 text-white">Target Audience</h3>
                            <p className="text-gray-300 font-light leading-relaxed">{result.poster_details?.target_audience}</p>
                        </GlassCard>
                        <GlassCard className="md:col-span-2">
                            <h3 className="text-xl font-bold mb-4 text-white">Brief Summary</h3>
                            <p className="text-gray-300 font-light leading-relaxed">{result.poster_details?.brief_summary}</p>
                        </GlassCard>
                    </>
                );
            case 'document':
                return (
                    <>
                        <GlassCard className="md:col-span-2">
                            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-3">
                                <FileText className="w-6 h-6 text-brand-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" /> 
                                Simplified Explanation
                            </h3>
                            <p className="text-gray-300 font-light leading-relaxed text-lg">{result.document_details?.simplified_explanation}</p>
                        </GlassCard>
                        {result.document_details?.key_points && result.document_details.key_points.length > 0 && (
                            <GlassCard className="md:col-span-2">
                                <h3 className="text-xl font-bold mb-4 text-white">Key Points</h3>
                                <ul className="space-y-4">
                                    {result.document_details.key_points.map((point, idx) => (
                                        <li key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple font-bold shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                                                {idx + 1}
                                            </span>
                                            <span className="text-gray-300 font-light mt-1">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full space-y-8 relative z-10"
        >
            <div className="text-center mb-8">
                <motion.div variants={itemVariants} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-cyan/20 border border-brand-cyan/40 rounded-full text-brand-cyan text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    <Layout className="w-4 h-4" /> 
                    {result.category} Detected
                </motion.div>
            </div>

            {userPrompt && (
                <GlassCard>
                    <div className="flex gap-4 items-start">
                        <div className="p-3 bg-brand-purple/20 rounded-2xl border border-brand-purple/30">
                            <MessageSquare className="w-6 h-6 text-brand-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-brand-purple uppercase tracking-wider mb-2">Your Question / Context</h3>
                            <p className="text-gray-200 font-medium text-lg italic">"{userPrompt}"</p>
                        </div>
                    </div>
                </GlassCard>
            )}

            <GlassCard>
                <div className="flex gap-4 items-start">
                    <div className="p-3 bg-brand-cyan/20 rounded-2xl border border-brand-cyan/30">
                        <Info className="w-6 h-6 text-brand-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-brand-cyan uppercase tracking-wider mb-2">Core Description</h3>
                        <p className="text-white font-light text-2xl leading-relaxed">
                            {result.simplified_description}
                        </p>
                    </div>
                </div>
            </GlassCard>

            {result.detailed_breakdown && (
                <GlassCard>
                    <div className="flex gap-4 items-start">
                        <div className="p-3 bg-brand-purple/20 rounded-2xl border border-brand-purple/30">
                            <FileText className="w-6 h-6 text-brand-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-brand-purple uppercase tracking-wider mb-2">Detailed Breakdown</h3>
                            <div className="text-gray-300 font-light text-lg leading-relaxed whitespace-pre-wrap">
                                {result.detailed_breakdown}
                            </div>
                        </div>
                    </div>
                </GlassCard>
            )}

            {result.actionable_insights && result.actionable_insights.length > 0 && (
                <GlassCard>
                    <div className="flex gap-4 items-start">
                        <div className="p-3 bg-rose-400/20 rounded-2xl border border-rose-400/30">
                            <Sparkles className="w-6 h-6 text-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4">Actionable Insights</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.actionable_insights.map((insight, idx) => (
                                    <li key={idx} className="flex gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                        <span className="text-rose-400 font-bold shrink-0">{idx + 1}.</span>
                                        <span className="text-gray-200">{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </GlassCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderCategorySpecific()}
            </div>
        </motion.div>
    );
};

export default ResultViewer;
