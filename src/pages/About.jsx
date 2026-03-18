import { useRef, useState, useEffect } from 'react';
import { lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollAnimations';

const RevealWaveImage = lazy(() => import('@/components/ui/reveal-wave-image').then(module => ({ default: module.RevealWaveImage })));
import brand from '@/assets/brandwo.png';
import SEOHelmet from '@/components/SEOHelmet';

export default function About() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax for Hero
  const heroImageY = useTransform(scrollYProgress, [0, 0.5], ["0%", "50%"]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  // Parallax for quote section background
  const quoteBgY = useTransform(scrollYProgress, [0.3, 0.8], ["0%", "20%"]);

  return (
    <div ref={containerRef} className="bg-[#FAF9F6] min-h-screen overflow-hidden">
      <SEOHelmet 
        title="About Chai Adda | India's Premium Organic Tea Brand"
        description="Learn about Chai Adda, India's premium organic tea brand. Discover our heritage, 100% organic quality, and mission to serve authentic chai across India."
        url="https://www.chaiadda.co.in/about"
        breadcrumbs={[
            { name: "Home", url: "https://www.chaiadda.co.in/" },
            { name: "About Us", url: "https://www.chaiadda.co.in/about" }
        ]}
      />

      {/* HERO SECTION */}
      <section className="relative h-[70vh] sm:h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Parallax Background Image */}
        <motion.div
          style={{ y: isMobile ? 0 : heroImageY }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=75&w=1280"
            alt="Tea Garden Dawn"
            className="w-full h-full object-cover brightness-[0.6] scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#FAF9F6]" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ y: isMobile ? 0 : heroTextY }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="block text-[#FAF9F6] drop-shadow-md text-sm md:text-base font-sans font-bold uppercase tracking-[0.3em] mb-4"
          >
            EST. 1974
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display font-bold text-4xl sm:text-7xl md:text-8xl text-white leading-[0.9] tracking-tight mb-6 sm:mb-8 drop-shadow-lg"
          >
            Legacy in <br /> <span className="italic font-serif font-medium text-[#D4F57B]">Every Leaf</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/90 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md px-2"
          >
            50 years of mastery, one family's unwavering promise, and a journey from a bicycle to the world.
          </motion.p>
        </motion.div>
      </section>


      {/* STORY SECTION - TIMELINE STYLE */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:py-32 space-y-32 relative">

        {/* Vertical Line for Timeline (Desktop) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/5 hidden md:block" />

        {/* Intro Story */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-6">Our Story — <span className="italic font-serif text-[#385040]">From One Man’s Dream to Your Cup</span></h2>
            <p className="text-gray-600 text-lg leading-relaxed font-serif">
              More than 50 years ago, in a small village, a young man began a simple journey with a powerful belief — that a truly good cup of tea has the power to bring people together.
            </p>
          </ScrollReveal>
        </div>


        {/* Chapter 1: The Beginning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          <div className="order-2 md:order-1 md:pr-16 md:text-right">
            <ScrollReveal>
              <span className="text-[#385040] font-bold text-xs uppercase tracking-widest mb-2 block">Chapter I</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] mb-6">A Journey with <br /><span className="italic font-serif text-[#385040]">Passion</span></h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 font-serif">
                With nothing but passion and an uncompromising commitment to quality, he left his village and moved to the city. There, he began trading tea — not as just another commodity, but as something far more meaningful. For him, tea was never just a drink.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-serif">
                It was an experience, an aroma that fills homes, a moment of pause in a busy day, a reason for people to sit together and talk.
              </p>
            </ScrollReveal>
          </div>
          <div className="order-1 md:order-2 relative">
            <ScrollReveal delay={0.2} className="relative z-10 w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 bg-gray-200">
              <Suspense fallback={<div className="w-full h-full bg-gray-200 animate-pulse" />}>
                <RevealWaveImage
                  src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=75&w=600"
                  alt="Vintage Bicycle"
                  className="w-full h-full object-cover sepia-[0.3]"
                />
              </Suspense>
            </ScrollReveal>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4F57B]/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>

        {/* Quote Break */}
        <ScrollReveal className="py-12 md:py-20 relative overflow-hidden rounded-3xl my-20">
          <motion.div
            style={{ y: quoteBgY }}
            className="absolute inset-0 bg-[#385040] z-0"
          >
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          </motion.div>

          <div className="relative z-10 text-center px-6 md:px-20 py-16">
            <blockquote className="font-display text-3xl sm:text-5xl font-medium text-white leading-tight mb-8">
              "For him, tea was never just a drink."
            </blockquote>
            <p className="text-white/70 text-lg sm:text-xl font-light font-serif max-w-3xl mx-auto">
              Over the decades, he built relationships with tea growers, carefully selecting teas that met his one simple standard — if it wasn’t good enough for his own cup, it wasn’t good enough for anyone else’s.
            </p>
          </div>
        </ScrollReveal>

        {/* Chapter 2: The Craft */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          <div className="order-1 md:pl-16 relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#385040] rounded-full border-4 border-[#FAF9F6] z-20 hidden md:block" />

            <ScrollReveal className="relative z-10 w-full aspect-square rounded-full overflow-hidden shadow-2xl border-8 border-white bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=75&w=600"
                alt="Tasting Tea"
                loading="lazy"
                className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000"
                onLoad={(e) => e.target.style.opacity = 1}
                style={{ opacity: 0, transition: 'opacity 0.7s ease-in-out' }}
              />
            </ScrollReveal>
          </div>
          <div className="order-2 md:pl-12">
            <ScrollReveal delay={0.2}>
              <span className="text-[#385040] font-bold text-xs uppercase tracking-widest mb-2 block">Chapter II</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] mb-6">The Next <br /><span className="italic font-serif text-[#385040]">Generation</span></h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 font-serif">
                Shopkeepers trusted him. Families trusted him. And slowly, cup by cup, his tea found its way into countless homes. But one man can only travel so far. There are still countless homes where his tea hasn’t yet reached.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-serif mb-6">
                Countless mornings that haven’t yet begun with that same rich aroma he has spent decades perfecting. That is where we come in.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-serif">
                As the next generation of this legacy, we grew up watching this dedication firsthand — the early mornings, the careful selection, the belief that quality should never be compromised.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Chapter 3: Trust & Legacy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          <div className="order-2 md:order-1 md:pr-16 md:text-right">
            <ScrollReveal>
              <span className="text-[#385040] font-bold text-xs uppercase tracking-widest mb-2 block">Chapter III</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] mb-6">Trust in <br /><span className="italic font-serif text-[#385040]">Every Cup</span></h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 font-serif">
                Today, we are taking that same tea, the same standards, and the same passion beyond the physical markets — bringing it directly to homes across the country through our online platform.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-serif">
                Our goal is simple. To make sure that no matter where you are, you can experience the same tea that families have trusted for over five decades.
              </p>
            </ScrollReveal>
          </div>
          <div className="order-1 md:order-2 relative">
            <ScrollReveal delay={0.2} className="relative z-10 w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-700 bg-gray-200">
              <Suspense fallback={<div className="w-full h-full bg-gray-200 animate-pulse" />}>
                <RevealWaveImage
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=75&w=600"
                  alt="Tea Cup"
                  className="w-full h-full object-cover"
                />
              </Suspense>
            </ScrollReveal>
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#385040]/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>


      </div>

      {/* Chapter 4: The Promise (Full Width) */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:py-32 relative">
        <div className="py-20 text-center max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="w-20 h-1 bg-[#385040] mx-auto mb-10" />
            <h2 className="font-display text-4xl sm:text-6xl font-bold text-[#1a1a1a] mb-8">Our <span className="text-[#385040] italic font-serif">Promise</span></h2>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed font-serif mb-12">
              And we say this with complete confidence:
              <br /><br />
              Taste it once. Just once. The richness, the aroma, the freshness — it speaks for itself.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-serif mb-12">
              And from that day on, your mornings may never begin the same way again. Because a great day often starts with a truly great cup of tea.
            </p>
            <div className="space-y-4">
              <p className="font-bold text-xl text-[#1a1a1a]">And we’re proud to bring that cup to you.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
            <ScrollReveal delay={0.1} className="p-8 bg-white rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg mb-2 text-[#385040] uppercase tracking-wider">Purity</h4>
              <p className="text-gray-500 text-sm">Sourced directly from the finest gardens, untouched and unadulterated.</p>
            </ScrollReveal>
            <ScrollReveal delay={0.2} className="p-8 bg-white rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg mb-2 text-[#385040] uppercase tracking-wider">Passion</h4>
              <p className="text-gray-500 text-sm">Blended with the expertise of 50 years of relentless dedication.</p>
            </ScrollReveal>
            <ScrollReveal delay={0.3} className="p-8 bg-white rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg mb-2 text-[#385040] uppercase tracking-wider">Provenance</h4>
              <p className="text-gray-500 text-sm">Tracing every leaf back to its origin, honoring the soil it grew in.</p>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* FOOTER SIGNATURE AREA */}
      <section className="bg-[#385040] py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

        <ScrollReveal className="relative z-10">
          <p className="text-white/60 font-serif italic text-xl mb-6">With gratitude,</p>
          <h3 className="font-display text-3xl sm:text-5xl text-white font-bold mb-8">The Next Generation</h3>
          <img src={brand} alt="Chai Adda Logo" className="h-16 mx-auto opacity-80 brightness-0 invert" />
          <p className="text-white/40 text-sm mt-8 uppercase tracking-widest">Carrying the legacy forward.</p>
        </ScrollReveal>
      </section>

    </div>
  );
}

