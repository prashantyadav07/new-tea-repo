import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ShieldCheck, Leaf, Truck, Smile, ShieldPlus, Heart, Activity, Ribbon, Zap, SmilePlus, Bone, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollAnimations';
import blogbg from '@/assets/blogbg.webp';

export default function IngredientsSection() {
  const ingredientsRef = useRef(null);

  const { scrollYProgress: ingredientsScroll } = useScroll({
    target: ingredientsRef,
    offset: ["start end", "end start"]
  });

  // Ingredients Animation: Circular Rotation
  const circleRotate = useTransform(ingredientsScroll, [0, 1], [0, 360]); // Rotate entire ring
  const itemRotate = useTransform(ingredientsScroll, [0, 1], [0, -360]); // Counter-rotate items to keep upright

  // Opacity for fade in/out of the whole section content
  const sectionOpacity = useTransform(ingredientsScroll, [0.1, 0.3, 0.8, 1], [0, 1, 1, 0]);

  const ingredients = [
    { name: "Oral Health", origin: "Health", icon: Smile, angle: 0 },
    { name: "Better Immune System", origin: "Immunity", icon: ShieldPlus, angle: 40 },
    { name: "Healthy Heart", origin: "Vitality", icon: Heart, angle: 80 },
    { name: "Healthy Digestive Tract", origin: "Digestion", icon: Activity, angle: 120 },
    { name: "Cancer Prevention", origin: "Wellness", icon: Ribbon, angle: 160 },
    { name: "Increases \"JOSH IN YOU\"", origin: "Energy", icon: Zap, angle: 200 },
    { name: "Happiness Factor", origin: "Mood", icon: SmilePlus, angle: 240 },
    { name: "Stronger Bones", origin: "Strength", icon: Bone, angle: 280 },
    { name: "Skin & Hair Health", origin: "Beauty", icon: Sparkles, angle: 320 },
  ];

  const radius = 300; // Radius of the circle in pixels

  return (
    <section ref={ingredientsRef} className="bg-gradient-to-b from-white to-[#F5F5F0] py-8 sm:py-24 px-4 overflow-hidden relative border-t border-black/50 min-h-[100vh] sm:min-h-[150vh]">
      <motion.div style={{ opacity: sectionOpacity }} className="sticky top-0 h-[85vh] sm:h-screen flex flex-col justify-center items-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl sm:text-6xl font-black uppercase text-[#385040] mb-4 sm:mb-8 relative z-20 text-center -mt-8 sm:mt-0">
            Chai Adda <br />
            <span className="text-tea-primary"> 9 miracles</span>
          </h2>
        </ScrollReveal>

        {/* Wrapper for Circular Layout — responsive on all screen sizes */}
        <div className="relative w-[320px] h-[320px] sm:w-[90vw] sm:h-auto sm:max-w-[1000px] sm:aspect-square flex items-center justify-center mt-12 sm:mt-0">

          {/* Central Image */}
          <div className="absolute z-10 w-48 h-48 sm:w-96 sm:h-96 md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] p-1.5 sm:p-2 -mt-8 sm:-mt-12 md:-mt-16">
            <div className="w-full h-full relative flex items-center justify-center">
              <img
                src={blogbg}
                alt="Tea Ingredients"
                width="500"
                height="500"
                loading="lazy"
                className="w-full h-full object-contain filter drop-shadow-2xl scale-[0.80]"
              />
            </div>
          </div>

          {/* Rotating Ring Container — visible on ALL screen sizes */}
          {/* Desktop ring (md+) */}
          <motion.div
            style={{ rotate: circleRotate }}
            className="absolute w-full h-full hidden md:flex items-center justify-center pointer-events-none"
          >
            {ingredients.map((item) => {
              const angleRad = (item.angle * Math.PI) / 180;
              const x = radius * Math.cos(angleRad);
              const y = radius * Math.sin(angleRad);

              return (
                <motion.div
                  key={item.name}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    x: "-50%",
                    y: "-50%"
                  }}
                >
                  <motion.div
                    style={{ rotate: itemRotate }}
                    className="flex flex-col items-center gap-2 p-2"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#385040] flex items-center justify-center text-white shadow-xl ring-4 ring-white/50 backdrop-blur-sm">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div className="text-center w-36">
                      <span className="font-bold font-sans text-sm uppercase tracking-widest block text-[#385040] bg-white/50 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-black/5 mx-auto w-fit">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mt-1 font-medium bg-white/40 px-2 rounded-full w-fit mx-auto">{item.origin}</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile ring (below md) — smaller radius, same scroll-driven rotation */}
          <motion.div
            style={{ rotate: circleRotate }}
            className="absolute w-full h-full flex md:hidden items-center justify-center pointer-events-none"
          >
            {ingredients.map((item) => {
              const mobileRadius = 155; // Increased radius for 9 items
              const angleRad = (item.angle * Math.PI) / 180;
              const x = mobileRadius * Math.cos(angleRad);
              const y = mobileRadius * Math.sin(angleRad);

              return (
                <motion.div
                  key={item.name}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    x: "-50%",
                    y: "-50%"
                  }}
                >
                  <motion.div
                    style={{ rotate: itemRotate }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#385040] flex items-center justify-center text-white shadow-lg ring-2 ring-white/50">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="text-center w-20 sm:w-24 mt-0.5">
                      <span className="font-bold font-sans text-[7px] sm:text-[9px] uppercase tracking-wider block text-[#385040] bg-white/80 backdrop-blur-md px-1.5 py-0.5 rounded-full shadow-sm border border-black/5 mx-auto w-fit leading-tight">{item.name}</span>
                      <span className="text-[6px] sm:text-[8px] text-muted-foreground uppercase tracking-wider block mt-[1px] font-medium">{item.origin}</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>

        {/* Badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-8 sm:gap-16 relative z-20">
          <ScrollReveal delay={0.5} className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-12 h-12 text-[#385040]" strokeWidth={1.5} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#385040]">100% Organic</span>
          </ScrollReveal>
          <ScrollReveal delay={0.6} className="flex flex-col items-center gap-2">
            <Leaf className="w-12 h-12 text-[#385040]" strokeWidth={1.5} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#385040]">Non-GMO</span>
          </ScrollReveal>
          <ScrollReveal delay={0.7} className="flex flex-col items-center gap-2">
            <Truck className="w-12 h-12 text-[#385040]" strokeWidth={1.5} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#385040]">Direct Trade</span>
          </ScrollReveal>
        </div>

      </motion.div>
    </section>
  );
}
