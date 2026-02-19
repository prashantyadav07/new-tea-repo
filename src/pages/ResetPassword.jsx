import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authAPI';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, ArrowRight, CheckCircle, ShieldAlert, Eye, EyeOff } from 'lucide-react';

const FloatingInput = ({ icon: Icon, type = 'text', label, value, onChange, id, disabled, showPasswordToggle }) => {
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
                disabled={disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
          w-full bg-[#FAF9F6] border-2 rounded-2xl py-4 pl-12 pr-12 outline-none transition-all duration-300 font-medium text-gray-800
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

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [redirectCount, setRedirectCount] = useState(3);

    // Validate that token and email are present
    const isMissingParams = !token || !email;

    // Auto-redirect to login after success
    useEffect(() => {
        if (!success) return;

        const timer = setInterval(() => {
            setRedirectCount((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/login', { replace: true });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [success, navigate]);

    // Clear sensitive state on unmount
    useEffect(() => {
        return () => {
            setPassword('');
            setConfirmPassword('');
        };
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!password || !confirmPassword) {
            setError('Please fill in both password fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await authAPI.resetPassword({ token, email, password });
            setSuccess(true);
            // Clear sensitive data immediately
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            const data = err.response?.data;
            setError(data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [password, confirmPassword, token, email]);

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
                            New <br /> Password
                        </h2>
                        <p className="text-xl text-white/80 max-w-md font-serif italic">
                            "Choose a strong password to keep your account safe."
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Minimum 6 Characters",
                            "Secure & Encrypted",
                            "Instant Activation"
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
                        <h1 className="font-display text-4xl sm:text-5xl font-black text-[#385040] mb-3">Reset Password</h1>
                        <p className="text-gray-500">Create a new password for your account.</p>
                    </motion.div>

                    {isMissingParams ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <ShieldAlert className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="font-bold text-red-800 text-lg">Invalid Reset Link</h3>
                            <p className="text-red-700 text-sm leading-relaxed">
                                This password reset link is invalid or incomplete. Please request a new one.
                            </p>
                            <Link
                                to="/forgot-password"
                                className="inline-flex items-center gap-2 text-[#385040] font-bold hover:underline mt-4"
                            >
                                Request New Link <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ) : success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-bold text-green-800 text-lg">Password Reset Successfully!</h3>
                            <p className="text-green-700 text-sm leading-relaxed">
                                Your password has been updated. You will be redirected to the login page in{' '}
                                <span className="font-bold">{redirectCount}s</span>.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-[#385040] font-bold hover:underline mt-4"
                            >
                                <ArrowLeft className="w-4 h-4" /> Go to Login Now
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
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                                        <ShieldAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <FloatingInput
                                    icon={Lock}
                                    type="password"
                                    id="reset-password"
                                    label="New Password"
                                    showPasswordToggle
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />

                                <FloatingInput
                                    icon={Lock}
                                    type="password"
                                    id="reset-confirm-password"
                                    label="Confirm New Password"
                                    showPasswordToggle
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#385040] text-white h-14 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#2c3e32] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#385040]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Reset Password <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
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
