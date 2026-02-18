import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const teaImages = [
    {
        url: "https://plus.unsplash.com/premium_photo-1692049122910-d8b131ed54c1?w=1200&auto=format&fit=crop&q=80",
        title: "Artisanal Selection",
        desc: "Hand-picked leaves from the heart of tea gardens."
    },
    {
        url: "https://images.unsplash.com/photo-1544787216-75fe7ba68b59?w=1200&auto=format&fit=crop&q=80",
        title: "Morning Rituals",
        desc: "Start your day with clarity and tradition."
    },
    {
        url: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=1200&auto=format&fit=crop&q=80",
        title: "Herbal Purity",
        desc: "100% natural ingredients for a healthy lifestyle."
    },
    {
        url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&auto=format&fit=crop&q=80",
        title: "Premium Oolong",
        desc: "A complex flavor profile for the true connoisseur."
    }
];

export default function TeaCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9
        })
    };

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % teaImages.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + teaImages.length) % teaImages.length);
    };

    // Auto-slide
    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[400px] sm:h-[600px] lg:h-[800px] overflow-hidden bg-tea-dark rounded-[1.5rem] sm:rounded-[3rem] my-8 sm:my-20">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.4 },
                        scale: { duration: 0.4 }
                    }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={teaImages[currentIndex].url}
                            alt={teaImages[currentIndex].title}
                            className="w-full h-full object-cover brightness-75 transition-transform duration-[10s] ease-linear transform scale-100 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="font-display text-3xl sm:text-5xl lg:text-8xl text-white font-bold mb-4 sm:mb-6 uppercase tracking-tighter"
                        >
                            {teaImages[currentIndex].title}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/80 text-lg lg:text-xl max-w-xl font-medium"
                        >
                            {teaImages[currentIndex].desc}
                        </motion.p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute inset-x-0 bottom-6 sm:bottom-12 flex items-center justify-between px-4 sm:px-8 lg:px-20 z-10">
                <button
                    onClick={prevSlide}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all group"
                >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* Progress Dots */}
                <div className="flex gap-3">
                    {teaImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`h-1.5 transition-all duration-500 rounded-full ${index === currentIndex ? 'w-12 bg-tea-primary' : 'w-2 bg-white/30 hover:bg-white/50'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all group"
                >
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
