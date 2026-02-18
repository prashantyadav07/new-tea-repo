import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollAnimations';
import { RevealWaveImage } from '@/components/ui/reveal-wave-image';
import brand from '@/assets/brandwo.png';

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
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-6">Our Story — <span className="italic font-serif text-[#385040]">Born from Legacy, Brewed with Emotion</span></h2>
            <p className="text-gray-600 text-lg leading-relaxed font-serif">
              This is not just tea. This is 50 years of legacy, love, and unwavering belief — a legacy built by my father, bold Mr. Pawan Kumar Aggarwal, which I am proud to carry forward as his daughter.
            </p>
          </ScrollReveal>
        </div>


        {/* Chapter 1: The Beginning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          <div className="order-2 md:order-1 md:pr-16 md:text-right">
            <ScrollReveal>
              <span className="text-[#385040] font-bold text-xs uppercase tracking-widest mb-2 block">Chapter I</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] mb-6">A Journey on <br /><span className="italic font-serif text-[#385040]">Two Wheels</span></h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 font-serif">
                His journey began with nothing but courage and determination. He left his village, Sonjani, and came to Muzaffarnagar in search of work. With no resources, no guarantees — only hope — he started selling tea on a bicycle. One connection at a time. One cup at a time.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-serif">
                Even today, after decades, he remains deeply connected to his work. Tea was never just a business for him — it was a relationship. He knew his vendors personally. He understood tea beyond buying and selling. He understood its soul.
              </p>
            </ScrollReveal>
          </div>
          <div className="order-1 md:order-2 relative">
            <ScrollReveal delay={0.2} className="relative z-10 w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 bg-gray-200">
              <RevealWaveImage
                src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=75&w=600"
                alt="Vintage Bicycle"
                className="w-full h-full object-cover sepia-[0.3]"
              />
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
              "Chaiwalo ka ghar kahan hai?"
            </blockquote>
            <p className="text-white/70 text-lg sm:text-xl font-light font-serif max-w-3xl mx-auto">
              In our neighborhood, people didn’t ask for our address. They simply asked, “Chaiwalo ka ghar kahan hai?” — and everyone knew. Our identity was built on tea. Our home was known because of tea. And we carried that identity with pride.
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
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] mb-6">The Soul of <br /><span className="italic font-serif text-[#385040]">The Leaf</span></h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 font-serif">
                My childhood memories are filled with the aroma of tea. Our home was always surrounded by samples from different tea gardens. We never bought tea packets — tea lived with us. I watched my father taste countless varieties, carefully observing every detail.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-serif mb-6">
                He would often say that the true character of tea reveals itself when made under the open sky, in real conditions, with precise measurements — because tea is not just tasted, it is understood.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-serif">
                We grew up with one word at the center of our lives — Chai.
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
                I saw how tea built trust. How people would come once, and then never go anywhere else. They would say, “Aggarwal ji, we will only drink your tea.” Not because he sold tea, but because he served honesty in every cup.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-serif">
                Through tea, he built lifelong relationships — from small chai stalls to large corporates. His belief was simple and powerful: “Is chai ki baat hi alag hai.”
              </p>
            </ScrollReveal>
          </div>
          <div className="order-1 md:order-2 relative">
            <ScrollReveal delay={0.2} className="relative z-10 w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-700 bg-gray-200">
              <RevealWaveImage
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=75&w=600"
                alt="Tea Cup"
                className="w-full h-full object-cover"
              />
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
            <h2 className="font-display text-4xl sm:text-6xl font-bold text-[#1a1a1a] mb-8">A Daughter's <span className="text-[#385040] italic font-serif">Promise</span></h2>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed font-serif mb-12">
              Watching his passion, his dedication, and his love for tea, I always carried one dream in my heart — to take his legacy forward and share it with the world.
              <br /><br />
              That dream has taken shape today as Do Ghoont and TEAVA — where every sip carries peace, warmth, and emotion.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-serif mb-12">
              Our promise is simple — tea that travels straight from the gardens to your cup, preserving its true essence — so that every sip feels like your first morning in the tea gardens of Assam.
            </p>
            <div className="space-y-4">
              <p className="italic text-[#385040] text-lg font-serif">For me, this is not a business.</p>
              <p className="font-bold text-xl text-[#1a1a1a]">This is my identity. This is my inheritance. This is my emotion.</p>
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
          <p className="text-white/60 font-serif italic text-xl mb-6">With love and gratitude,</p>
          <h3 className="font-display text-3xl sm:text-5xl text-white font-bold mb-8">The Chaiwala's Daughter</h3>
          <img src={brand} alt="Borsillah Logo" className="h-16 mx-auto opacity-80 brightness-0 invert" />
          <p className="text-white/40 text-sm mt-8 uppercase tracking-widest">I am, and always will be, proud to be a chaiwala’s daughter.</p>
        </ScrollReveal>
      </section>

    </div>
  );
}

