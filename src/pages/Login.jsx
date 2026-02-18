import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

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

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const from = location.state?.from?.pathname || '/shop';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await login(formData);
            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred');
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
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#385040] via-transparent to-transparent" />

                <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
                    <div>
                        <h2 className="font-display font-black text-6xl uppercase leading-none mb-6">
                            Welcome <br /> Back
                        </h2>
                        <p className="text-xl text-white/80 max-w-md font-serif italic">
                            "There is something in the nature of tea that leads us into a world of quiet contemplation of life."
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Exclusive Member Discounts",
                            "Curated Monthly Blends",
                            "Track Your Orders"
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
                        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#385040] mb-3">Sign In</h1>
                        <p className="text-gray-500">Enter your credentials to access your account.</p>
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
                            icon={Mail}
                            type="email"
                            id="email"
                            label="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <div>
                            <FloatingInput
                                icon={Lock}
                                type="password"
                                id="password"
                                label="Password"
                                showPasswordToggle
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <div className="flex justify-end mt-2">
                                <Link to="/forgot-password" className="text-xs font-bold text-[#385040] hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#385040] text-white h-14 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#2c3e32] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#385040]/20 disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
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
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-bold text-[#385040] hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative py-4"
                    >
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-[#FAF9F6] px-4 text-gray-400 font-bold">Or continue with</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <button className="flex items-center justify-center gap-2 h-12 bg-white border-2 border-transparent hover:border-gray-200 rounded-xl transition-all shadow-sm hover:shadow-md text-sm font-bold text-gray-700">
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 h-12 bg-white border-2 border-transparent hover:border-gray-200 rounded-xl transition-all shadow-sm hover:shadow-md text-sm font-bold text-gray-700">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            GitHub
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
