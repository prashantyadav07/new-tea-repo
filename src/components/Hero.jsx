import { memo } from 'react';
import { Link } from 'react-router-dom';
import chailogo from '../assets/chailogo.webp';
import section1Png from '@/assets/section-1.png';

const Hero = memo(() => {
  return (
    <section
      className="relative min-h-[100dvh] w-full flex items-center justify-center pt-24 lg:pt-32 pb-12"
    >
      {/* Background — purely decorative, must not block scroll */}
      <div className="absolute inset-0 bg-[#FAF9F6] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between px-4 sm:px-10 lg:px-20 gap-8 lg:gap-0 mt-8 sm:mt-12 lg:mt-16">

        <div className='md:hidden w-full flex justify-center mb-2'>
          <img
            src={chailogo}
            alt="Chai Adda Logo"
            className="max-w-[100px] sm:max-w-[120px] w-full h-auto object-contain"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Main Typography (Left) */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4.5rem] leading-[1.1] text-[#385040] opacity-0 animate-fade-in-up [animation-fill-mode:forwards] [animation-delay:0.1s]">
            Elevate Your
          </h1>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4.5rem] leading-[1.1] text-[#385040] mt-1 lg:mt-2 opacity-0 animate-fade-in-up [animation-fill-mode:forwards] [animation-delay:0.2s]">
            Everyday Sip
          </h1>

          <p className="mt-4 sm:mt-6 lg:mt-8 text-gray-700 text-sm sm:text-base lg:text-lg max-w-md font-medium tracking-wide leading-relaxed opacity-0 animate-fade-in-up [animation-fill-mode:forwards] [animation-delay:0.3s]">
            Introducing authentic, nature-backed herbal tea blends for your daily ritual.
          </p>

          <div className="mt-6 sm:mt-8 lg:mt-10 mb-2 opacity-0 animate-fade-in-up [animation-fill-mode:forwards] [animation-delay:0.4s]">
            <Link to="/shop" className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#D4F57B] text-[#2E4235] font-bold uppercase tracking-widest text-xs sm:text-sm shadow-xl hover:bg-[#385040] hover:text-white transition-colors duration-300">
              Shop Now
            </Link>
          </div>

          {/* Customers (Below Text) */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center lg:justify-start gap-3 sm:gap-4 opacity-0 animate-fade-in-up [animation-fill-mode:forwards] [animation-delay:0.5s]">
            <div className="flex -space-x-3 sm:-space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-[#385040] overflow-hidden bg-gray-300 shadow-xl">
                  <img src={`https://i.pravatar.cc/100?img=${i + 40}`} width="48" height="48" alt="User" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-[#385040] font-bold text-base sm:text-lg lg:text-xl leading-none">3K+</p>
              <p className="text-gray-500 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-widest">Customers</p>
            </div>
          </div>
        </div>

        {/* Key Product Image (Right) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-6 sm:mt-10 lg:mt-0 opacity-0 animate-scale-in [animation-fill-mode:forwards] [animation-delay:0.1s]">
          <img
            src={section1Png}
            fetchPriority="high"
            loading="eager"
            alt="Premium Tea Pouch"
            className="w-[85vw] max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] h-auto object-contain"
          />
        </div>

      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
