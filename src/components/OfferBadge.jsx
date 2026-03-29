import { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import { offerAPI } from '../services/offerAPI';

/**
 * OfferBadge — shows a small badge/ribbon for offers linked to a product
 * @param {{ productId: string }} props
 */
export default function OfferBadge({ productId }) {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        if (!productId) return;
        const fetchOffers = async () => {
            try {
                const res = await offerAPI.getOffersByProduct(productId);
                if (res.success && Array.isArray(res.data) && res.data.length > 0) setOffers(res.data);
            } catch { /* silent */ }
        };
        fetchOffers();
    }, [productId]);

    if (offers.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1.5">
            {offers.slice(0, 2).map(offer => (
                <span key={offer._id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-md text-[11px] font-semibold">
                    <Gift className="w-3 h-3" />
                    {offer.title}
                </span>
            ))}
        </div>
    );
}
