import { memo } from 'react';
import { Link } from 'react-router-dom';
import chailogo from '../assets/chailogo.webp';
import section1Png from '@/assets/section-1.png';
import { ArrowRight, Star } from 'lucide-react';

const Hero = memo(() => {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 hero-bg" aria-hidden="true" />
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />
      <div className="hero-orb hero-orb-3" aria-hidden="true" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col lg:grid lg:grid-cols-2 items-center min-h-[100dvh] px-5 sm:px-10 lg:px-16 xl:px-24 gap-0 lg:gap-0 pt-10 lg:pt-16">

        {/* Typography — TOP on mobile, LEFT on desktop */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-24 sm:pt-28 lg:pt-0 order-1 pb-0 lg:pb-0">

          {/* Logo — mobile only, centered, above heading */}
          <div className='flex lg:hidden w-full justify-center mb-5'>
            <img src={chailogo} alt="Chai Adda Logo" className="max-w-[80px] w-full h-auto object-contain" loading="eager" fetchPriority="high" />
          </div>

          {/* Main heading */}
          <div className="overflow-hidden">
            <h1 className="hero-title mt-0 lg:mt-16 text-[2.5rem] sm:text-[3.5rem] lg:text-[5.5rem] xl:text-[7rem] 2xl:text-[8rem] text-white/90 opacity-0 hero-text-reveal [animation-delay:0.2s] [animation-fill-mode:forwards]">
              Elevate Your
            </h1>
          </div>
          <div className="overflow-hidden -mt-1 lg:-mt-4">
            <h1 className="hero-title text-[2.5rem] sm:text-[3.5rem] lg:text-[5.5rem] xl:text-[7rem] 2xl:text-[8rem] opacity-0 hero-text-reveal [animation-delay:0.35s] [animation-fill-mode:forwards]">
              <span className="text-white/90">Everyday </span><span className="hero-title-shimmer italic">Sip</span>
            </h1>
          </div>

          {/* Decorative line */}
          <div className="w-16 sm:w-20 lg:w-28 h-[1px] bg-gradient-to-r from-[#C4D6B0]/60 to-transparent mt-4 sm:mt-6 lg:mt-8 opacity-0 hero-line-grow [animation-delay:0.5s] [animation-fill-mode:forwards]" />

          {/* Sub copy */}
          <p className="mt-3 sm:mt-5 lg:mt-7 text-white/40 text-xs sm:text-sm lg:text-[17px] max-w-[280px] sm:max-w-sm lg:max-w-md font-sans font-light tracking-wide leading-[1.7] lg:leading-[1.8] opacity-0 hero-text-reveal [animation-delay:0.55s] [animation-fill-mode:forwards]">
            Authentic herbal blends from Assam's finest tea gardens.
            <span className="text-[#C8A96E]"> Nature in every cup.</span>
          </p>

          {/* CTAs */}
          <div className="mt-5 sm:mt-7 lg:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 opacity-0 hero-text-reveal [animation-delay:0.65s] [animation-fill-mode:forwards]">
            <Link to="/shop" className="hero-glow-btn group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-[18px] bg-[#C4D6B0] text-[#0f1f15] font-sans font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] text-[10px] sm:text-[11px] lg:text-xs rounded-full hover:scale-[1.03] transition-all duration-300">
              Shop Collection
              <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 px-5 sm:px-7 lg:px-8 py-3 sm:py-3.5 lg:py-[18px] rounded-full hero-glass text-white/70 font-sans font-semibold uppercase tracking-[0.15em] lg:tracking-[0.2em] text-[10px] sm:text-[11px] lg:text-xs hover:text-white hover:bg-white/[0.08] transition-all duration-300">
              Our Legacy
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-6 sm:mt-10 lg:mt-14 flex items-center gap-4 sm:gap-6 lg:gap-10 opacity-0 hero-text-reveal [animation-delay:0.8s] [animation-fill-mode:forwards]">
            <div className="text-center lg:text-left">
              <p className="text-white font-display text-2xl sm:text-3xl lg:text-4xl font-light">3K<span className="text-[#C4D6B0]">+</span></p>
              <p className="text-white/30 text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-[0.2em] lg:tracking-[0.25em] mt-0.5 sm:mt-1">Customers</p>
            </div>
            <div className="w-px h-7 sm:h-10 bg-white/10" />
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <p className="text-white font-display text-2xl sm:text-3xl lg:text-4xl font-light">4.8</p>
                <div className="flex gap-[1px] sm:gap-[2px] mt-0.5 sm:mt-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={8} className="sm:w-[10px] sm:h-[10px] fill-[#C8A96E] text-[#C8A96E]" />)}
                </div>
              </div>
              <p className="text-white/30 text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-[0.2em] lg:tracking-[0.25em] mt-0.5 sm:mt-1">Rating</p>
            </div>
            <div className="w-px h-7 sm:h-10 bg-white/10" />
            <div className="text-center lg:text-left">
              <p className="text-white font-display text-2xl sm:text-3xl lg:text-4xl font-light">50<span className="text-[#C8A96E]">+</span></p>
              <p className="text-white/30 text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-[0.2em] lg:tracking-[0.25em] mt-0.5 sm:mt-1">Years</p>
            </div>
          </div>
        </div>

        {/* Product Image — BOTTOM on mobile, RIGHT on desktop */}
        <div className="relative flex items-center justify-center order-2 lg:order-2 pt-4 lg:pt-0 pb-10 lg:pb-0">
          {/* Radial glow — desktop only, causes visible dot on mobile */}
          <div className="absolute hidden lg:block lg:w-[700px] lg:h-[700px] rounded-full bg-[radial-gradient(circle,rgba(94,140,97,0.2)_0%,rgba(200,169,110,0.08)_40%,transparent_70%)] blur-2xl pointer-events-none" aria-hidden="true" />

          {/* Circular border accents — desktop only */}
          <div className="absolute hidden lg:block lg:w-[550px] lg:h-[550px] xl:w-[650px] xl:h-[650px] rounded-full border border-white/[0.04] pointer-events-none" aria-hidden="true" />
          <div className="absolute hidden lg:block lg:w-[460px] lg:h-[460px] xl:w-[540px] xl:h-[540px] rounded-full border border-white/[0.03] pointer-events-none" aria-hidden="true" />

          <img
            src={section1Png}
            fetchPriority="high"
            loading="eager"
            alt="Premium Tea Pouch"
            className="relative z-10 hero-img-float w-[80vw] max-w-[320px] sm:max-w-[400px] lg:max-w-[600px] xl:max-w-[720px] 2xl:max-w-[800px] h-auto object-contain lg:mt-40 drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] lg:drop-shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          />
        </div>

      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#385040] to-transparent pointer-events-none z-10" aria-hidden="true" />
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
