import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollAnimations';
import { FileText, Gavel, Scale, AlertCircle, Ban, HelpCircle } from 'lucide-react';

const sections = [
    {
        icon: Gavel,
        title: 'Agreement to Terms',
        content: [
            'By accessing or using the Borsillah website, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
            'If you do not agree with any of these terms, you are prohibited from using or accessing this site.',
            'We reserve the right to update or modify these terms at any time without prior notice.',
        ],
    },
    {
        icon: Scale,
        title: 'Use License',
        content: [
            'Permission is granted to temporarily download one copy of the materials on Borsillah for personal, non-commercial transitory viewing only.',
            'This is the grant of a license, not a transfer of title, and under this license, you may not modify or copy the materials.',
            'You may not use the materials for any commercial purpose or for any public display.',
        ],
    },
    {
        icon: AlertCircle,
        title: 'Disclaimer',
        content: [
            'The materials on Borsillah are provided on an "as is" basis. Borsillah makes no warranties, expressed or implied.',
            'Borsillah does not warrant that the materials on its website are accurate, complete, or current.',
            'Product descriptions and pricing are subject to change without notice.',
        ],
    },
    {
        icon: Ban,
        title: 'Limitations',
        content: [
            'In no event shall Borsillah or its suppliers be liable for any damages arising out of the use or inability to use the materials.',
            'Borsillah is not responsible for any information or content on websites linked to its site.',
            'These limitations apply even if Borsillah or an authorized representative has been notified of the possibility of such damage.',
        ],
    },
    {
        icon: HelpCircle,
        title: 'Governing Law',
        content: [
            'These terms and conditions are governed by and construed in accordance with the laws of India.',
            'Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts in Muzaffarnagar, Uttar Pradesh.',
            'Our failure to enforce any right or provision of these terms will not be considered a waiver of those rights.',
        ],
    },
];

export default function TermsOfService() {
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
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNNDQgNDRjMCAyLTIgNC00IDRzLTQtMi00LTQgMi00IDQtNHM0IDIgNCA0eiIvPjwvZz48L2c+PC9zdmc+')]" />
                </motion.div>

                <motion.div style={{ y: heroTextY }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 rounded-2xl bg-[#D4F57B]/20 flex items-center justify-center mx-auto mb-6"
                    >
                        <FileText className="w-8 h-8 text-[#D4F57B]" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-display font-bold text-4xl sm:text-6xl md:text-7xl text-white leading-[0.9] tracking-tight mb-6"
                    >
                        Terms of <span className="italic font-serif text-[#D4F57B]">Service</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto"
                    >
                        Please read these terms carefully before using our website or purchasing our products.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-white/40 text-sm mt-4"
                    >
                        Last updated: February 2026
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

                <ScrollReveal>
                    <div className="mt-16 p-8 sm:p-12 bg-white border border-black/5 rounded-2xl text-center">
                        <h3 className="font-display text-2xl font-bold text-[#385040] mb-3">Acceptance of Terms</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto italic">
                            "By using Borsillah, you acknowledge that you have read, understood, and agree to be bound by these terms."
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
