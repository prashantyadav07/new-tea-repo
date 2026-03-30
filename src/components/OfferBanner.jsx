import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { offerAPI } from '../services/offerAPI';

export default function OfferBanner() {
    const [offers, setOffers] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await offerAPI.getActiveOffers();
                if (res.success) {
                    const data = Array.isArray(res.data) ? res.data : [];
                    const bannerOffers = data.filter(o => o.displayType?.includes('banner') && o.bannerImage?.url);
                    setOffers(bannerOffers);
                }
            } catch { /* silent */ }
        };
        fetchOffers();
    }, []);

    useEffect(() => {
        if (offers.length <= 1) return;
        const timer = setInterval(() => setCurrent(c => (c + 1) % offers.length), 5000);
        return () => clearInterval(timer);
    }, [offers.length]);

    if (offers.length === 0) return null;

    return (
        <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm">
            <AnimatePresence mode="wait">
                <motion.div key={current}
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}>
                    <a href="#" className="block relative">
                        <img
                            src={offers[current].bannerImage.url}
                            alt={offers[current].title}
                            className="w-full h-32 sm:h-48 md:h-56 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-end p-4 sm:p-6">
                            <div>
                                <h3 className="text-white font-bold text-lg sm:text-2xl drop-shadow-md">{offers[current].title}</h3>
                                {offers[current].description && (
                                    <p className="text-white/80 text-sm mt-1 drop-shadow-md line-clamp-1">{offers[current].description}</p>
                                )}
                            </div>
                        </div>
                    </a>
                </motion.div>
            </AnimatePresence>

            {offers.length > 1 && (
                <>
                    <button onClick={() => setCurrent(c => (c - 1 + offers.length) % offers.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full hover:bg-white shadow-sm">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setCurrent(c => (c + 1) % offers.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full hover:bg-white shadow-sm">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {offers.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)}
                                className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
