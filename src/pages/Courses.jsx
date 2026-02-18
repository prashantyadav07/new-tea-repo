import { Star, Users, Clock, PlayCircle, BookOpen, Award } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollAnimations';

export default function Courses() {
  const courses = [
    {
      id: 1,
      title: 'Art of Tea Tasting',
      description: 'Develop your palate and learn the professional techniques for evaluating tea quality and flavor profiles.',
      level: 'Beginner',
      duration: '4 weeks',
      students: 1250,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500',
    },
    {
      id: 2,
      title: 'Global Tea Cultivation',
      description: 'Master the science behind tea growing, from soil chemistry to harvesting seasons across the globe.',
      level: 'Advanced',
      duration: '6 weeks',
      students: 580,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1576091160550-2173bdd99602?w=500',
    },
    {
      id: 3,
      title: 'Matcha Mastery',
      description: 'Complete guide to Japanese Matcha: history, preparation ceremonies, and modern culinary uses.',
      level: 'Intermediate',
      duration: '3 weeks',
      students: 890,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1582722872445-44ad5c7c0460?w=500',
    },
    {
      id: 4,
      title: 'Tea Business & Export',
      description: 'Learn the logistics of the tea industry, from sourcing directly to managing a retail boutique.',
      level: 'Advanced',
      duration: '10 weeks',
      students: 420,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=500',
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24">
      {/* Page Header */}
      <section className="relative py-20 overflow-hidden bg-[#385040]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <ScrollReveal>
            <span className="px-4 py-1 bg-tea-primary/20 text-tea-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">Learning Academy</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tighter">
              Master the Craft <br /><span className="text-tea-primary italic">of Tea</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">
              Join our expert-led sessions and deepen your connection with the world's most sophisticated beverage.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-10">
          {courses.map((course, i) => (
            <ScrollReveal key={course.id} delay={i * 0.1}>
              <div className="group bg-white border border-gray-100 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col sm:flex-row h-full">
                {/* Course Header Image */}
                <div className="sm:w-2/5 h-48 sm:h-64 sm:h-auto overflow-hidden relative">
                  <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 sm:p-8 sm:w-3/5 flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(course.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                    ))}
                    <span className="text-xs font-bold text-gray-500 ml-2">{course.rating} Rating</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-black mb-3 sm:mb-4 group-hover:text-tea-primary transition-colors uppercase tracking-tight">
                    {course.title}
                  </h3>

                  <p className="text-gray-500 mb-6 text-sm leading-relaxed flex-1">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span className="text-xs font-bold uppercase">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={16} />
                      <span className="text-xs font-bold uppercase">{course.students}</span>
                    </div>
                  </div>

                  <button className="w-full bg-black text-white font-bold py-4 px-6 rounded-2xl hover:bg-tea-primary transition-all flex items-center justify-center gap-2 group/btn">
                    Enroll Now
                    <PlayCircle className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16 sm:py-24 rounded-[2rem] sm:rounded-[4rem] mx-2 sm:mx-4 mb-10 sm:mb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-black">
            <ScrollReveal>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-tea-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3 uppercase">Expert Material</h4>
                <p className="text-gray-500 text-sm">Comprehensive guides and exclusive research from master sommeliers.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-tea-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3 uppercase">Private Community</h4>
                <p className="text-gray-500 text-sm">Join our exclusive Discord for monthly live tastings and Q&A.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-tea-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3 uppercase">Certifications</h4>
                <p className="text-gray-500 text-sm">Earn industry-recognized certificates for every milestone achieved.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
