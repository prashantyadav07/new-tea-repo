import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollAnimations';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';

const blogPosts = [
    {
        id: 1,
        title: 'The Art of Brewing the Perfect Masala Chai',
        excerpt: 'Discover the secrets behind balancing spices and tea for the ultimate soul-warming cup.',
        category: 'Brewing Guides',
        author: 'Jatin Aggarwal',
        date: 'Feb 12, 2026',
        image: 'https://images.unsplash.com/photo-1544411047-c491584222f0?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 2,
        title: 'Sustainable Tea: From Garden to Cup',
        excerpt: 'How we ensure every leaf is ethically sourced and every package is planet-friendly.',
        category: 'Sustainability',
        author: 'Anita Sharma',
        date: 'Feb 08, 2026',
        image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 3,
        title: '5 Incredible Health Benefits of Green Tea',
        excerpt: 'Beyond the refreshing taste, learn why green tea is a powerhouse for your body and mind.',
        category: 'Health',
        author: 'Dr. Rahul Mehta',
        date: 'Feb 05, 2026',
        image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 4,
        title: 'The History of Borsillah Tea Estate',
        excerpt: 'Travel back through time to witness the legacy of our gardens and the families behind them.',
        category: 'Legacy',
        author: 'Vikram Singh',
        date: 'Jan 28, 2026',
        image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800',
    },
];

export default function Blog() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const heroImageY = useTransform(scrollYProgress, [0, 0.4], ['0%', '30%']);
    const heroTextY = useTransform(scrollYProgress, [0, 0.4], ['0%', '50%']);

    return (
        <div ref={containerRef} className="bg-[#FAF9F6] min-h-screen overflow-hidden" data-scroll-container>
            {/* HERO SECTION */}
            <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: heroImageY }} className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1492707892479-7bc2d5a827ec?auto=format&fit=crop&q=80&w=1920"
                        alt="Tea and Writing"
                        className="w-full h-full object-cover brightness-[0.6] scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#FAF9F6]" />
                </motion.div>

                <motion.div style={{ y: heroTextY }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-display font-bold text-5xl sm:text-7xl md:text-8xl text-white leading-[0.9] tracking-tight mb-8"
                    >
                        Tea <span className="italic font-serif font-medium text-[#D4F57B]">Journal</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Exploration, education, and inspiration from the world of premium tea.
                    </motion.p>
                </motion.div>
            </section>

            {/* BLOG FEED */}
            <section className="py-20 sm:py-32 max-w-7xl mx-auto px-4">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
                    <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto scrollbar-hide">
                        {['All', 'Brewing Guides', 'Sustainability', 'Health', 'Legacy'].map((cat, i) => (
                            <button
                                key={cat}
                                className={`px-6 py-2 rounded-full border border-black/10 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all ${i === 0 ? 'bg-[#385040] text-white' : 'bg-white text-[#385040] hover:bg-[#385040]/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-12 pr-6 py-3 bg-white border border-black/5 rounded-full text-sm focus:outline-none focus:border-[#385040] transition-colors shadow-sm"
                        />
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                    {blogPosts.map((post, i) => (
                        <ScrollReveal key={post.id} delay={i * 0.1}>
                            <article className="group cursor-pointer">
                                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-8 shadow-xl">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-[#D4F57B] text-[#385040] text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#385040]/60">
                                        <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {post.date}</span>
                                        <span className="flex items-center gap-2"><User className="w-3 h-3" /> By {post.author}</span>
                                    </div>
                                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a] leading-tight group-hover:text-[#385040] transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 line-clamp-2 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-4">
                                        <span className="inline-flex items-center gap-2 text-[#385040] font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                                            Read Article <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-32 flex justify-center gap-4">
                    <button className="w-12 h-12 rounded-full border border-black/5 bg-white flex items-center justify-center text-sm font-bold shadow-sm hover:bg-[#385040] hover:text-white transition-all">1</button>
                    <button className="w-12 h-12 rounded-full border border-black/5 bg-white flex items-center justify-center text-sm font-bold shadow-sm hover:bg-[#385040] hover:text-white transition-all opacity-50">2</button>
                    <button className="w-12 h-12 rounded-full border border-black/5 bg-white flex items-center justify-center text-sm font-bold shadow-sm hover:bg-[#385040] hover:text-white transition-all opacity-50">3</button>
                </div>
            </section>

            {/* NEWSLETTER (Integration with Footer design) */}
            <section className="bg-[#385040] py-24 text-center text-white px-4">
                <ScrollReveal>
                    <Tag className="w-12 h-12 mx-auto mb-6 text-[#D4F57B]" />
                    <h2 className="font-display text-3xl sm:text-5xl font-bold mb-6">Never miss a brew.</h2>
                    <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
                        Get our latest brewing guides and tea stories delivered straight to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-8 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4F57B] transition-colors"
                        />
                        <button className="px-8 py-4 bg-[#D4F57B] text-[#385040] rounded-full font-bold uppercase tracking-widest hover:bg-[#c8e96f] transition-all">
                            Join
                        </button>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
}
