import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#385040] flex items-center justify-center">
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-4 mx-auto backdrop-blur-sm"
                >
                    {/* Leaf Icon or Brand Logo could go here, using simple Loader for now */}
                    <div className="relative">
                        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white font-display font-bold text-xl tracking-widest uppercase"
                >
                    Tea Haven
                </motion.h2>
                <p className="text-white/50 text-xs mt-2 font-medium tracking-wider">Brewing perfection...</p>
            </div>
        </div>
    );
}
