import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollAnimations';
import { Truck, Globe, Clock, RefreshCcw, ShieldCheck, MapPin } from 'lucide-react';

const sections = [
    {
        icon: Globe,
        title: 'Shipping Zones',
        content: [
            'We currently ship to all major cities across India.',
            'International shipping is available to selected countries including USA, UK, Canada, and UAE.',
            'Shipping costs are calculated at checkout based on your location and package weight.',
        ],
    },
    {
        icon: Clock,
        title: 'Processing Times',
        content: [
            'Orders are processed within 1-2 business days from the time of purchase.',
            'Orders placed on weekends or public holidays will be processed on the next business day.',
            'You will receive a tracking number via email once your order has been dispatched.',
        ],
    },
    {
        icon: Truck,
        title: 'Delivery Timelines',
        content: [
            'Domestic (India): 3-7 business days depending on the city.',
            'International: 10-21 business days depending on customs and local carrier efficiency.',
            'Express shipping options are available for faster delivery in select metro areas.',
        ],
    },
    {
        icon: RefreshCcw,
        title: 'Returns & Refunds',
        content: [
            'We offer a 7-day return policy for unopened and undamaged tea products.',
            'If you receive a damaged or incorrect item, please contact us within 48 hours of delivery.',
            'Refunds are processed back to the original payment method within 5-10 business days after we receive the return.',
        ],
    },
    {
        icon: ShieldCheck,
        title: 'Order Guarantee',
        content: [
            'We guarantee the freshness and quality of every package we send.',
            'Our packaging is designed to withstand transit while keeping the tea leaves in perfect condition.',
            'If your package is lost in transit, we will send a replacement at no extra cost.',
        ],
    },
];

export default function ShippingPolicy() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const heroImageY = useTransform(scrollYProgress, [0, 0.3], ['0%', '30%']);
    const heroTextY = useTransform(scrollYProgress, [0, 0.3], ['0%', '60%']);

    return (
        <div ref={containerRef} className="bg-[#FAF9F6] min-h-screen overflow-hidden" data-scroll-container>
            {/* HERO */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: heroImageY }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a20] via-[#2E4235] to-[#385040]" />
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCA0LTRzNCAgMiA0IDQtMiA0LTQgNC00LTItNC00eiIvPjwvZz48L2c+PC9zdmc+')]" />
                </motion.div>

                <motion.div style={{ y: heroTextY }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 rounded-2xl bg-[#D4F57B]/20 flex items-center justify-center mx-auto mb-6"
                    >
                        <Truck className="w-8 h-8 text-[#D4F57B]" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-display font-bold text-4xl sm:text-6xl md:text-7xl text-white leading-[0.9] tracking-tight mb-6"
                    >
                        Shipping <span className="italic font-serif text-[#D4F57B]">Policy</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto"
                    >
                        From our gardens to your doorstep. Learn about our delivery times, rates, and return policies.
                    </motion.p>
                </motion.div>
            </section>

            {/* CONTENT */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                {sections.map((section, i) => (
                    <ScrollReveal key={section.title} delay={i * 0.05}>
                        <div className="mb-12 sm:mb-16 group">
                            <div className="flex items-start gap-4 sm:gap-6">
                                <div className="w-12 h-12 rounded-xl bg-[#385040]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#385040] group-hover:text-white transition-colors duration-300 text-[#385040]">
                                    <section.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-4">
                                        {section.title}
                                    </h2>
                                    <ul className="space-y-3">
                                        {section.content.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4F57B] mt-2 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {i < sections.length - 1 && (
                                <div className="h-px bg-black/5 mt-12 sm:mt-16" />
                            )}
                        </div>
                    </ScrollReveal>
                ))}

                {/* Tracking Note */}
                <ScrollReveal>
                    <div className="mt-16 p-8 sm:p-12 bg-[#D4F57B] rounded-2xl text-center text-[#385040]">
                        <MapPin className="w-10 h-10 mx-auto mb-4" />
                        <h3 className="font-display text-2xl font-bold mb-3">Track Your Order</h3>
                        <p className="font-medium mb-6 max-w-md mx-auto">
                            Once your tea is on its way, you'll receive a link to track your package in real-time.
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
