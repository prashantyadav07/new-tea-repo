import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollAnimations';
import { Leaf, Sun, Wind, Droplets, Heart, Trees } from 'lucide-react';

export default function Sustainability() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const heroImageY = useTransform(scrollYProgress, [0, 0.5], ['0%', '20%']);
    const heroTextY = useTransform(scrollYProgress, [0, 0.5], ['0%', '40%']);

    const commitments = [
        {
            icon: Leaf,
            title: 'Plastic-Free Packaging',
            description: 'Our tea bags are made from plant-based materials and are 100% compostable. We avoid plastic liners in our boxes.',
        },
        {
            icon: Trees,
            title: 'Regenerative Farming',
            description: 'We partner with gardens that practice organic farming, preserving soil health and local biodiversity.',
        },
        {
            icon: Heart,
            title: 'Ethical Sourcing',
            description: 'Direct trade relationships ensure our farmers receive fair wages that go beyond industry standards.',
        },
        {
            icon: Sun,
            title: 'Solar Powered',
            description: 'Our main processing facility in Muzaffarnagar is powered by a 100kW solar array, reducing our carbon footprint.',
        },
    ];

    return (
        <div ref={containerRef} className="bg-[#FAF9F6] min-h-screen overflow-hidden" data-scroll-container>
            {/* HERO SECTION */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: heroImageY }} className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=1920"
                        alt="Sustainable Tea Garden"
                        className="w-full h-full object-cover brightness-[0.7] scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FAF9F6]" />
                </motion.div>

                <motion.div style={{ y: heroTextY }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display font-bold text-5xl sm:text-7xl md:text-8xl text-white leading-[0.9] tracking-tight mb-8"
                    >
                        Rooted in <br /> <span className="italic font-serif font-medium text-[#D4F57B]">Responsibility</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        Believing that the finest tea can only grow in a flourishing world.
                    </motion.p>
                </motion.div>
            </section>

            {/* CORE BELIEFS */}
            <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <ScrollReveal>
                            <span className="text-[#385040] font-bold text-xs uppercase tracking-widest mb-4 block">Our Commitment</span>
                            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] mb-8 leading-tight">
                                For the earth, <br /><span className="italic font-serif text-[#385040]">for the future.</span>
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                Sustainability isn't a department at Borsillah—it's the foundation of everything we do. From the way we source our leaves to the materials we use for our labels, we choose the path that preserves the planet.
                            </p>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {commitments.map((item, i) => (
                                <ScrollReveal key={item.title} delay={i * 0.1}>
                                    <div className="group">
                                        <div className="w-12 h-12 rounded-xl bg-[#385040]/5 flex items-center justify-center text-[#385040] mb-4 group-hover:bg-[#385040] group-hover:text-[#D4F57B] transition-colors duration-500">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-[#1a1a1a] mb-2">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <ScrollReveal delay={0.2} className="relative z-10 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1544411047-c491584222f0?auto=format&fit=crop&q=80&w=800"
                                alt="Compostable Tea Bag"
                                className="w-full h-full object-cover"
                            />
                        </ScrollReveal>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#D4F57B] rounded-full blur-[100px] opacity-20 z-0" />
                    </div>
                </div>
            </section>

            {/* STATS SECTION (Parallax Background) */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=1920"
                        alt="Tea Leaves Close-up"
                        className="w-full h-full object-cover brightness-[0.4]"
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: 'Plastic Free', value: '100%' },
                        { label: 'Farmers Impacted', value: '500+' },
                        { label: 'Carbon Offset', value: '25 Ton' },
                        { label: 'Organic Blends', value: '100%' },
                    ].map((stat, i) => (
                        <ScrollReveal key={stat.label} delay={i * 0.1}>
                            <div className="text-white">
                                <p className="text-4xl sm:text-6xl font-display font-black text-[#D4F57B] mb-2">{stat.value}</p>
                                <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] opacity-70">{stat.label}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-24 sm:py-32 text-center max-w-3xl mx-auto px-4">
                <ScrollReveal>
                    <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#385040] mb-8">Join the Movement</h2>
                    <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                        By choosing Borsillah, you aren't just buying premium tea; you're supporting a system that gives back to the earth more than it takes. Better for you, better for the planet.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/shop" className="px-10 py-4 bg-[#385040] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#2E4235] transition-colors">
                            Shop Organic
                        </a>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
}
