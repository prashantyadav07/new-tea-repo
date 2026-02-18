import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Truck, Coffee, Star } from 'lucide-react';

export default function TopRibbon() {
    const announcements = [
        { text: "100% ORGANIC & HERBAL BLENDS", icon: Leaf },
        { text: "PURE QUALITY GUARANTEE", icon: ShieldCheck },
        { text: "FAST GLOBAL SHIPPING ON ALL ORDERS", icon: Truck },
        { text: "HAND-PICKED FROM PREMIUM TEA ESTATES", icon: Coffee },
        { text: "EXPERIENCE THE ART OF BREWING", icon: Star },
    ];

    // Repeat items to ensure a seamless loop
    const content = [...announcements, ...announcements, ...announcements];

    return (
        <div className="bg-[#482F24] text-white py-2.5 overflow-hidden whitespace-nowrap border-b border-white/5 fixed top-0 left-0 right-0 z-[60]">
            <motion.div
                animate={{
                    x: [0, -1200], // Increased width for more items
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30, // Slower for better readability
                        ease: "linear",
                    },
                }}
                className="inline-flex gap-8 sm:gap-24 items-center px-4"
            >
                {content.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="flex items-center gap-3">
                            <Icon className="w-3.5 h-3.5 text-tea-primary fill-tea-primary" strokeWidth={3} />
                            <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em]">
                                {item.text}
                            </span>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}
