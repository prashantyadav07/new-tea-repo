import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

const FloatingInput = ({ icon: Icon, type = 'text', label, value, onChange, id, showPasswordToggle }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const finalType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative group">
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 ml-4 transition-colors duration-300 ${isFocused || value ? 'text-[#385040]' : 'text-gray-400'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <input
                type={finalType}
                id={id}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
          w-full bg-[#FAF9F6] border-2 rounded-2xl py-4 pl-12 pr-12 outline-none transition-all duration-300 font-medium text-gray-800
          ${isFocused ? 'border-[#385040] shadow-[0_0_0_4px_rgba(56,80,64,0.1)]' : 'border-transparent hover:border-gray-200'}
        `}
            />
            <label
                htmlFor={id}
                className={`
          absolute left-12 transition-all duration-300 pointer-events-none
          ${isFocused || value ? '-top-2.5 text-xs bg-[#FAF9F6] px-2 text-[#385040] font-bold' : 'top-1/2 -translate-y-1/2 text-gray-500 font-medium'}
        `}
            >
                {label}
            </label>

            {showPasswordToggle && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#385040] transition-colors"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            )}
        </div>
    );
};

export default function Signup() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await register(formData);
            if (result.success) {
                // If registration logs the user in automatically (which our context supports if token is returned)
                navigate('/shop');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-[#FAF9F6] flex items-stretch overflow-hidden">
            {/* Visual Section (Left) - Hidden on mobile */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex flex-1 relative bg-[#385040] overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#385040] via-transparent to-transparent" />

                <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
                    <div>
                        <h2 className="font-display font-black text-6xl uppercase leading-none mb-6">
                            Join The <br /> Community
                        </h2>
                        <p className="text-xl text-white/80 max-w-md font-serif italic">
                            "Begin your journey into the world of premium teas and wellness."
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            "First Access to New Harvests",
                            "Member-Only Tasting Events",
                            "Personalized Recommendations"
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <CheckCircle className="w-4 h-4 text-[#D4F57B]" />
                                </div>
                                <span className="font-medium tracking-wide">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Form Section (Right) */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-24 relative">
                <div className="w-full max-w-md space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center lg:text-left"
                    >
                        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#385040] mb-3">Create Account</h1>
                        <p className="text-gray-500">Sign up to start your tea journey with us.</p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <FloatingInput
                            icon={User}
                            type="text"
                            id="name"
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <FloatingInput
                            icon={Mail}
                            type="email"
                            id="email"
                            label="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <FloatingInput
                            icon={Lock}
                            type="password"
                            id="password"
                            label="Password"
                            showPasswordToggle
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <div className="flex items-start gap-3">
                            <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-gray-300 text-[#385040] focus:ring-[#385040]" />
                            <label htmlFor="terms" className="text-sm text-gray-500 leading-snug">
                                I agree to the <Link to="/terms" className="font-bold text-[#385040] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="font-bold text-[#385040] hover:underline">Privacy Policy</Link>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#385040] text-white h-14 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#2c3e32] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#385040]/20 disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center"
                    >
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-[#385040] hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
