import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Truck, Leaf, Star, Wind, Flame, Bean, Flower2, Utensils, Trees, Mountain } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollAnimations';
import TeaCarousel from '@/components/TeaCarousel';
import ProductCard from '@/components/ProductCard';
import brand from '@/assets/brandwo.png';
import bro from '../assets/bro.png';
import { productAPI } from '@/services/productAPI';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products for home", error);
      }
    };
    fetchProducts();
  }, []);

  const containerRef = useRef(null);
  const collectionsRef = useRef(null);
  const ingredientsRef = useRef(null);
  const packSectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: ingredientsScroll } = useScroll({
    target: ingredientsRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: packScroll } = useScroll({
    target: packSectionRef,
    offset: ["start end", "end start"]
  });

  // Pack Section Parallax
  const packImageY = useTransform(packScroll, [0, 1], [0, -100]);
  const packImageRotate = useTransform(packScroll, [0, 1], [0, 10]);

  // Ingredients Animation: Circular Rotation
  const circleRotate = useTransform(ingredientsScroll, [0, 1], [0, 360]); // Rotate entire ring
  const itemRotate = useTransform(ingredientsScroll, [0, 1], [0, -360]); // Counter-rotate items to keep upright

  // Opacity for fade in/out of the whole section content
  const sectionOpacity = useTransform(ingredientsScroll, [0.1, 0.3, 0.8, 1], [0, 1, 1, 0]);

  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  // Parallax transforms for Hero section
  const heroText1Y = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroText2Y = useTransform(scrollYProgress, [0, 0.3], [0, 200]);
  const heroImageY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroImageScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  const featuredTeas = products.slice(0, 4);

  // Bounded parallax for Featured Collections
  const { scrollYProgress: collectionsScroll } = useScroll({
    target: collectionsRef,
    offset: ["start end", "end start"]
  });
  const collectionsTitleY = useTransform(collectionsScroll, [0, 1], [100, -100]);

  // Ingredients Data
  const ingredients = [
    { name: "Cinnamon", origin: "Sri Lanka", icon: Utensils, angle: 0 },
    { name: "Cloves", origin: "Madagascar", icon: Flower2, angle: 60 },
    { name: "Star Anise", origin: "Vietnam", icon: Star, angle: 120 },
    { name: "Fennel Seeds", origin: "Mediterranean", icon: Wind, angle: 180 },
    { name: "Ginger", origin: "India", icon: Flame, angle: 240 },
    { name: "Cardamom", origin: "Guatemala", icon: Bean, angle: 300 },
  ];

  const radius = 300; // Radius of the circle in pixels

  return (
    <div ref={containerRef} className="bg-[#385040] overflow-x-hidden" data-scroll-container>

      {/* HERO SECTION (Sounder Replica) */}
      <section className="relative h-screen min-h-[580px] sm:min-h-[800px] w-full flex items-center justify-center overflow-hidden">

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#008001] to-[#2E4235]" />

        <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto flex flex-col items-center justify-center px-4 overflow-hidden">
          <div className='h-16 -mt-40  md:hidden'>
            <img className='h-18 mt-10 ' src={bro} alt="" />
          </div>
          {/* Main Typography */}
          <div className="flex flex-col mt-20 items-center text-center -mt-16 sm:-mt-20 px-2 w-full">
            <motion.h1
              style={{ y: heroText1Y }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-bold text-[13vw] sm:text-[9vw] lg:text-[8rem] leading-[0.9] tracking-tight text-white uppercase select-none"
            >
              ELEVATE YOUR
            </motion.h1>
            <motion.h1
              style={{ y: heroText2Y }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-bold text-[15vw] sm:text-[11vw] lg:text-[11rem] leading-[0.9] tracking-tight text-white uppercase select-none relative z-0"
            >
              EVERYDAY SIP
            </motion.h1>
          </div>

          {/* Customers (Left) - Desktop only */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-[45%] left-10 lg:left-24 mt-60 items-center gap-4 hidden lg:flex"
          >
            <div className="flex -space-x-4 ">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#385040] overflow-hidden bg-gray-300 shadow-xl">
                  <img src={`https://i.pravatar.cc/100?img=${i + 40}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xl leading-none">3K+</p>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Customers</p>
            </div>
          </motion.div>

          {/* Video Preview (Right) - Desktop only */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-[10%] right-10 lg:right-24 hidden lg:block"
          >
            <div className="w-64 h-40 bg-white/5 backdrop-blur-md rounded-[32px] overflow-hidden relative group cursor-pointer border border-white/10 hover:border-white/20 transition-all shadow-2xl">
              <img src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=500" alt="Video" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-[#D4F57B] rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Key Product Image (Centered & Overlapping) */}
          <motion.div
            style={{ y: heroImageY, scale: heroImageScale, x: "-50%" }}
            initial={{ y: 150, opacity: 0, rotate: 5 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="absolute top-[60%]  lg:top-[46%] left-1/2 z-20 pointer-events-none w-[95vw]  max-w-[600px]"
          >
            <img
              src={brand}
              alt="Premium Tea Pouch"
              className="w-full h-auto drop-shadow-[0_40px_70px_rgba(0,0,0,0.5)] object-contain filter brightness-105 contrast-105"
            />
          </motion.div>

        </div>
      </section>

      {/* MARQUEE SECTION */}
      <div className="py-6 sm:py-20 bg-[#D4F57B] overflow-hidden flex items-center">
        <motion.div style={{ x: marqueeX }} className="flex whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-10 mx-2 sm:mx-5 text-2xl sm:text-6xl lg:text-7xl font-sans font-black text-black uppercase tracking-tighter italic">
              <span>Pure Aroma</span>
              <span className="w-1.5 h-1.5 sm:w-4 sm:h-4 bg-black rounded-full flex-shrink-0" />
              <span>Organic Blend</span>
              <span className="w-1.5 h-1.5 sm:w-4 sm:h-4 bg-black rounded-full flex-shrink-0" />
              <span>Timeless Taste</span>
              <span className="w-1.5 h-1.5 sm:w-4 sm:h-4 bg-black rounded-full flex-shrink-0" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* PRODUCTS SECTION */}
      <section ref={collectionsRef} className="py-12 mt-0 md:mt-10 sm:py-32 bg-white md:rounded-t-[2rem] sm:rounded-t-[4rem] -mt-10 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-20 gap-4 sm:gap-8">
            <div className="max-w-xl text-left">
              <ScrollReveal once={false}>
                {/* Static heading on mobile, parallax on desktop */}
                <h2 className="font-sans font-black text-4xl sm:text-6xl text-black uppercase leading-none mb-4 sm:mb-6 lg:hidden">
                  Featured <br /> Collections
                </h2>
                <motion.h2
                  style={{ y: collectionsTitleY }}
                  className="font-sans font-black lg:text-8xl text-black uppercase leading-none mb-6 hidden lg:block"
                >
                  Featured <br /> Collections
                </motion.h2>
                <p className="text-gray-500 text-sm sm:text-lg font-medium">
                  Discover our most prestigious blends, hand-picked for their exceptional flavor profiles and curative properties.
                </p>
              </ScrollReveal>
            </div>
            <Link to="/shop" className="px-5 sm:px-10 py-2.5 sm:py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors text-xs sm:text-base whitespace-nowrap">
              Explore All
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-x-8 gap-y-5 sm:gap-y-16">
            {featuredTeas.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S IN YOUR PACK SECTION (Redesigned) */}
      <section ref={packSectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-[#FAF9F6]">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-[#385040]/5 -skew-x-12 transform origin-top-right z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4F57B]/10 rounded-full blur-3xl z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left Column: Parallax Visuals */}
            <div className="relative perspective-1000 group">
              {/* Main Pack Image */}
              <motion.div
                style={{ y: packImageY, rotate: packImageRotate }}
                className="relative z-20 mx-auto w-64 sm:w-80 md:w-96"
              >
                <div className="absolute inset-0 bg-black/20 blur-xl rounded-full transform scale-90 translate-y-10" />
                <img
                  src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800"
                  alt="Premium Tea Pack"
                  className="w-full h-auto rounded-2xl shadow-2xl relative z-10 transform transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>

              {/* Floating Element 1: Nature */}
              <motion.div
                style={{ y: useTransform(packScroll, [0, 1], [0, -50]) }}
                className="absolute top-10 -left-4 sm:-left-12 z-30 bg-white p-4 rounded-xl shadow-xl border border-black/5 flex items-center gap-3 w-48 sm:w-56"
              >
                <div className="w-10 h-10 rounded-full bg-[#D4F57B] flex items-center justify-center text-[#385040]">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#385040] text-sm leading-tight">100% Organic</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Certified Pure</p>
                </div>
              </motion.div>

              {/* Floating Element 2: Origin */}
              <motion.div
                style={{ y: useTransform(packScroll, [0, 1], [0, 80]) }}
                className="absolute bottom-20 -right-4 sm:-right-12 z-30 bg-white p-4 rounded-xl shadow-xl border border-black/5 flex items-center gap-3 w-48 sm:w-56"
              >
                <div className="w-10 h-10 rounded-full bg-[#385040] flex items-center justify-center text-white">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#385040] text-sm leading-tight">High Altitude</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Himalayan Grown</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Content */}
            <div>
              <ScrollReveal>
                <span className="text-[#385040] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Unveiling the Purity</span>
                <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-[#385040] mb-8 leading-[0.9]">
                  What's in Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4F57B] to-[#385040]">Daily Cup?</span>
                </h2>
              </ScrollReveal>

              <div className="space-y-8 mt-10">
                {/* Feature 1 */}
                <ScrollReveal delay={0.1} className="flex group">
                  <div className="mr-6 relative">
                    <div className="w-12 h-12 rounded-full border-2 border-[#385040]/10 flex items-center justify-center group-hover:bg-[#385040] group-hover:text-white transition-colors duration-300">
                      <Trees className="w-5 h-5" />
                    </div>
                    <div className="absolute top-12 left-1/2 w-px h-full bg-[#385040]/10 -translate-x-1/2" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#385040] mb-2">Forest Nurtured</h3>
                    <p className="text-gray-600 leading-relaxed max-w-md">
                      Grown in harmony with nature, our tea bushes are shaded by native trees, preserving the delicate ecosystem and enhancing flavor depth.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Feature 2 */}
                <ScrollReveal delay={0.2} className="flex group">
                  <div className="mr-6 relative">
                    <div className="w-12 h-12 rounded-full border-2 border-[#385040]/10 flex items-center justify-center group-hover:bg-[#385040] group-hover:text-white transition-colors duration-300">
                      <Star className="w-5 h-5" />
                    </div>
                    <div className="absolute top-12 left-1/2 w-px h-full bg-[#385040]/10 -translate-x-1/2" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#385040] mb-2">Whole Leaf Quality</h3>
                    <p className="text-gray-600 leading-relaxed max-w-md">
                      We use only the finest whole leaves, never dust or fannings. Experience the full spectrum of essential oils and antioxidants.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Feature 3 */}
                <ScrollReveal delay={0.3} className="flex group">
                  <div className="mr-6">
                    <div className="w-12 h-12 rounded-full border-2 border-[#385040]/10 flex items-center justify-center group-hover:bg-[#385040] group-hover:text-white transition-colors duration-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#385040] mb-2">Ethically Sourced</h3>
                    <p className="text-gray-600 leading-relaxed max-w-md">
                      From the foothills of the Himalayas to your cup, we ensure fair wages and sustainable practices at every step.
                    </p>
                  </div>
                </ScrollReveal>
              </div>

              <ScrollReveal delay={0.4} className="mt-12">
                <Link to="/about" className="inline-flex items-center gap-2 text-[#385040] font-bold uppercase tracking-widest text-sm hover:gap-4 transition-all group">
                  Read our full story <span className="w-8 h-px bg-[#385040] group-hover:w-12 transition-all" />
                </Link>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* BEST QUALITY INGREDIENTS SECTION */}
      <section ref={ingredientsRef} className="bg-gradient-to-b from-white to-[#F5F5F0] py-8 sm:py-24 px-4 overflow-hidden relative border-t border-black/50 min-h-[100vh] sm:min-h-[150vh]">
        <motion.div style={{ opacity: sectionOpacity }} className="sticky top-0 h-[85vh] sm:h-screen flex flex-col justify-center items-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-6xl font-black uppercase text-[#385040] mb-4 sm:mb-8 relative z-20 text-center">
              Best Quality <br />
              <span className="text-tea-primary">Ingredients</span>
            </h2>
          </ScrollReveal>

          {/* Wrapper for Circular Layout — responsive on all screen sizes */}
          <div className="relative w-[320px] h-[320px] sm:w-[90vw] sm:h-auto sm:max-w-[1000px] sm:aspect-square flex items-center justify-center -mt-4 sm:mt-0">

            {/* Central Image */}
            <div className="absolute z-10 w-32 h-32 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border-[1px] border-black/5 shadow-2xl p-1.5 sm:p-2 bg-white">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600"
                  alt="Tea Ingredients"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30 mix-blend-overlay" />
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
                const mobileRadius = 130; // Smaller radius for mobile screens
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
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#385040] flex items-center justify-center text-white shadow-lg ring-2 ring-white/50">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="text-center w-24">
                        <span className="font-bold font-sans text-[9px] uppercase tracking-wider block text-[#385040] bg-white/60 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm border border-black/5 mx-auto w-fit">{item.name}</span>
                        <span className="text-[8px] text-muted-foreground uppercase tracking-wider block mt-0.5 font-medium">{item.origin}</span>
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

      {/* TEA CAROUSEL SECTION */}
      <section className="bg-white py-6 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <TeaCarousel />

        </div>
      </section>
    </div>
  );
}
