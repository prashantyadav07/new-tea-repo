import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollAnimations';

// Custom Animated Input Component
const FloatingInput = ({ label, type = "text", placeholder, rows }) => {
  return (
    <div className="relative group">
      {rows ? (
        <textarea
          rows={rows}
          className="w-full bg-transparent border-b-2 border-gray-300 py-3 pr-4 text-gray-800 placeholder-transparent focus:outline-none focus:border-[#385040] transition-colors peer resize-none font-serif"
          placeholder={placeholder}
          id={label}
        />
      ) : (
        <input
          type={type}
          className="w-full bg-transparent border-b-2 border-gray-300 py-3 pr-4 text-gray-800 placeholder-transparent focus:outline-none focus:border-[#385040] transition-colors peer font-serif"
          placeholder={placeholder}
          id={label}
        />
      )}
      <label
        htmlFor={label}
        className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#385040] peer-focus:text-xs font-semibold uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#385040] transition-all duration-300 peer-focus:w-full" />
    </div>
  );
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />

      <div className="relative z-10 w-full overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-screen">

          {/* Left Side: Visual / Info */}
          <div className="relative min-h-[50vh] lg:h-auto bg-[#385040] flex flex-col justify-between p-8 lg:p-16 pt-32 lg:pt-40 text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 opacity-40">
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1887"
                alt="Tea Pouring"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#385040]/80 via-[#385040]/40 to-[#385040]/90" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[#D4F57B] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Get in Touch</span>
                <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6">
                  Let's Talk <br /><span className="italic font-serif text-[#D4F57B]">Tea.</span>
                </h1>
                <p className="text-white/80 text-lg max-w-md font-serif leading-relaxed">
                  Whether you're looking for the perfect blend, interested in wholesale, or just want to share your tea story – we're listening.
                </p>
              </motion.div>
            </div>

            {/* Contact Details */}
            <div className="relative z-10 space-y-8 mt-12 lg:mt-0">
              <motion.div
                className="flex items-start gap-5 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#385040] transition-colors duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email Us</h3>
                  <p className="text-white/70 text-sm font-light">hello@teamone.com</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-5 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#385040] transition-colors duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-white/70 text-sm font-light">+91 98765 43210</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-5 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#385040] transition-colors duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Visit Our Gardens</h3>
                  <p className="text-white/70 text-sm font-light">123 Tea Garden Lane, Darjeeling<br />West Bengal, India 734101</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="relative h-full bg-[#FAF9F6] flex flex-col justify-center p-8 lg:p-20 pt-32 lg:pt-40 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-lg w-full mx-auto"
            >
              <div className="mb-12">
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Send a Message</h2>
                <p className="text-gray-500 font-serif">We usually respond within 24 hours.</p>
              </div>

              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FloatingInput label="First Name" placeholder="John" />
                  <FloatingInput label="Last Name" placeholder="Doe" />
                </div>

                <FloatingInput label="Email Address" type="email" placeholder="john@example.com" />

                <FloatingInput label="Subject" placeholder="Wholesale Inquiry" />

                <FloatingInput label="Message" rows={4} placeholder="Tell us about yourself..." />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#385040] text-white py-4 rounded-none uppercase tracking-widest font-bold text-sm hover:bg-[#2c3e32] transition-colors flex items-center justify-center gap-2 mt-8 group"
                >
                  Send Message
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
