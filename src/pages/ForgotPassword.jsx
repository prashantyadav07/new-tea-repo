import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/authAPI';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, CheckCircle, ShieldAlert, Clock } from 'lucide-react';

const FloatingInput = ({ icon: Icon, type = 'text', label, value, onChange, id, disabled }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative group">
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 ml-4 transition-colors duration-300 ${isFocused || value ? 'text-[#385040]' : 'text-gray-400'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
          w-full bg-[#FAF9F6] border-2 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all duration-300 font-medium text-gray-800
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
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
        </div>
    );
};

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [rateLimited, setRateLimited] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const timerRef = useRef(null);

    // Countdown timer for rate limiting
    useEffect(() => {
        if (countdown <= 0) {
            setRateLimited(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setRateLimited(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [countdown]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await authAPI.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            const status = err.response?.status;
            const data = err.response?.data;

            if (status === 429) {
                setRateLimited(true);
                const retryAfter = data?.retryAfterSeconds || 900;
                setCountdown(retryAfter);
                setError(data?.message || 'Too many requests. Please try again later.');
            } else {
                setError(data?.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-[#FAF9F6] flex items-stretch overflow-hidden">
            {/* Visual Section (Left) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex flex-1 relative bg-[#385040] overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#385040] via-transparent to-transparent" />

                <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
                    <div>
                        <h2 className="font-display font-black text-6xl uppercase leading-none mb-6">
                            Reset Your <br /> Password
                        </h2>
                        <p className="text-xl text-white/80 max-w-md font-serif italic">
                            "Security is not a product, but a process."
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Secure Token-Based Reset",
                            "Time-Limited Links",
                            "Account Protection"
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
                        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#385040] mb-3">Forgot Password</h1>
                        <p className="text-gray-500">Enter your email and we'll send you a reset link.</p>
                    </motion.div>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-bold text-green-800 text-lg">Check Your Email</h3>
                            <p className="text-green-700 text-sm leading-relaxed">
                                If an account with that email exists, a password reset email has been sent. Please check your inbox and spam folder.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-[#385040] font-bold hover:underline mt-4"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Login
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {error && (
                                    <div className={`px-4 py-3 rounded-lg text-sm flex items-start gap-3 ${rateLimited
                                        ? 'bg-amber-50 border border-amber-200 text-amber-700'
                                        : 'bg-red-50 border border-red-200 text-red-600'
                                        }`}>
                                        {rateLimited ? (
                                            <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <ShieldAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        )}
                                        <div>
                                            <p>{error}</p>
                                            {rateLimited && countdown > 0 && (
                                                <p className="font-bold mt-1">
                                                    Try again in {formatTime(countdown)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <FloatingInput
                                    icon={Mail}
                                    type="email"
                                    id="forgot-email"
                                    label="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading || rateLimited}
                                />

                                <button
                                    type="submit"
                                    disabled={loading || rateLimited}
                                    className="w-full bg-[#385040] text-white h-14 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#2c3e32] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#385040]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Send Reset Link <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </motion.form>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-center"
                            >
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-gray-500 hover:text-[#385040] font-bold text-sm transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Login
                                </Link>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
