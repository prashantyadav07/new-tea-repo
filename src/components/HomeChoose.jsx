import React from 'react';
import { Check, X } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollAnimations';
import left from "../assets/cleft.webp"
import right from "../assets/cright.webp"
import cleft336 from '../assets/cleft-336w.webp'
import cleft672 from '../assets/cleft-672w.webp'
import cright336 from '../assets/cright-336w.webp'
import cright672 from '../assets/cright-672w.webp'

const HomeChoose = () => {
    return (
        <section className="bg-[#EBE9E0] py-16 sm:py-24 px-4 border-y border-[#385040]/10">
            <div className="max-w-6xl mx-auto">
                <ScrollReveal>
                    <h2 className="text-center font-sans font-black text-4xl sm:text-5xl md:text-6xl text-[#385040] mb-12 sm:mb-20 uppercase tracking-widest">
                        Why Choose Us ?
                    </h2>
                </ScrollReveal>

                <div className="flex flex-col md:flex-row items-center md:items-start justify-center relative gap-8 md:gap-0">

                    {/* Vertical Divider - Desktop only */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#385040]/20 -translate-x-1/2"></div>

                    {/* Left Side: Chaiadda Tea */}
                    <div className="w-full md:w-1/2 md:pr-12 lg:pr-20 flex flex-col items-center">
                        <ScrollReveal delay={0.1} className="w-full flex flex-col items-center">
                            <div className="w-48 h-48 sm:w-64 sm:h-64 mb-8 flex justify-center items-center">
                                <img
                                    src={left}
                                    alt="Chai Adda Tea"
                                    className="max-w-full max-h-full object-contain"
                                    width="336"
                                    height="285"
                                    loading="lazy"
                                    srcSet={`${cleft336} 336w, ${cleft672} 672w`}
                                    sizes="(max-width: 768px) 100vw, 336px"
                                />
                            </div>

                            <h3 className="w-full text-2xl md:text-3xl font-sans font-bold text-[#385040] mb-8 uppercase text-center">
                                Chai Adda Tea
                            </h3>

                            <ul className="space-y-4 w-fit mx-auto text-left">
                                {[
                                    "Whole ingredients",
                                    "Hand-blended with care",
                                    "Multiple quality checks",
                                    "Fresh, vibrant, and true to nature"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 md:gap-4">
                                        <Check className="w-6 h-6 text-green-500 flex-shrink-0" strokeWidth={4} />
                                        <span className="text-[#385040] font-medium text-lg lg:text-xl">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </ScrollReveal>
                    </div>

                    {/* Mobile Divider (Horizontal) */}
                    <div className="w-[80%] h-px bg-[#385040]/20 my-4 block md:hidden"></div>

                    {/* Right Side: Other Brands */}
                    <div className="w-full md:w-1/2 md:pl-12 lg:pl-20 flex flex-col items-center">
                        <ScrollReveal delay={0.2} className="w-full flex flex-col items-center">
                            <div className="w-48 h-48 sm:w-64 sm:h-64 mb-8 flex justify-center items-center">
                                <img
                                    src={right}
                                    alt="Other Tea Brands"
                                    className="max-w-full max-h-full object-contain"
                                    width="336"
                                    height="248"
                                    loading="lazy"
                                    srcSet={`${cright336} 336w, ${cright672} 672w`}
                                    sizes="(max-width: 768px) 100vw, 336px"
                                />
                            </div>

                            <h3 className="w-full text-2xl md:text-3xl font-sans font-bold text-[#385040] mb-8 uppercase text-center">
                                Other Brands
                            </h3>

                            <ul className="space-y-4 w-fit mx-auto text-left">
                                {[
                                    "Dust and fannings",
                                    "Mechanically mixed",
                                    "Dull and often artificial",
                                    "Minimal or no quality checks"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 md:gap-4">
                                        <X className="w-6 h-6 text-red-600 flex-shrink-0" strokeWidth={4} />
                                        <span className="text-[#385040]/80 font-medium text-lg lg:text-xl">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </ScrollReveal>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HomeChoose;
