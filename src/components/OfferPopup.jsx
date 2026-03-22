import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import { offerAPI } from '../services/offerAPI';

export default function OfferPopup() {
    const [offer, setOffer] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show popup only once per session
        if (sessionStorage.getItem('offerPopupShown')) return;

        const fetchPopupOffer = async () => {
            try {
                const res = await offerAPI.getActiveOffers();
                if (res.success) {
                    const popupOffer = res.data.find(o => o.displayType?.includes('popup'));
                    if (popupOffer) {
                        setOffer(popupOffer);
                        // Show after a 2s delay
                        setTimeout(() => setVisible(true), 2000);
                        sessionStorage.setItem('offerPopupShown', 'true');
                    }
                }
            } catch { /* silent */ }
        };
        fetchPopupOffer();
    }, []);

    const handleClose = () => setVisible(false);

    if (!offer) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
                    onClick={handleClose}>
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
                        onClick={e => e.stopPropagation()}>
                        <button onClick={handleClose}
                            className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm">
                            <X className="w-4 h-4" />
                        </button>

                        {offer.bannerImage?.url ? (
                            <img src={offer.bannerImage.url} alt={offer.title}
                                className="w-full h-48 object-cover" />
                        ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                <Gift className="w-16 h-16 text-white/80" />
                            </div>
                        )}

                        <div className="p-6 text-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold mb-3">
                                <Gift className="w-3 h-3" /> Special Offer
                            </div>
                            <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">{offer.title}</h3>
                            {offer.description && (
                                <p className="text-gray-500 text-sm mb-4">{offer.description}</p>
                            )}
                            <button onClick={handleClose}
                                className="w-full px-6 py-3 bg-[#385040] text-white font-semibold rounded-xl hover:bg-[#2c3e32] transition-colors">
                                Shop Now
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
