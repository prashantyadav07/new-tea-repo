import { Link } from 'react-router-dom';
import { Leaf, Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import bro from '../assets/bro.png'

export default function Footer() {
    const shopLinks = [
        { label: 'Green Tea', path: '/shop' },
        { label: 'Black Tea', path: '/shop' },
        { label: 'Herbal Blends', path: '/shop' },
        { label: 'Accessories', path: '/shop' },
        { label: 'Shipping Policy', path: '/shipping-policy' },
    ];

    const companyLinks = [
        { label: 'Our Story', path: '/about' },
        { label: 'Sustainability', path: '/sustainability' },
        { label: 'Blog', path: '/blog' },
        { label: 'Contact', path: '/contact' },
        { label: 'Track Order', path: '/track-order' },
        { label: 'Submit Complaint', path: '/complaint' },
    ];

    return (
        <footer className="bg-[#1A1A1A] text-white relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-tea-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Newsletter Section */}
            <div className="border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                                Stay in the <span className="text-tea-primary italic">Connection</span>
                            </h3>
                            <p className="text-gray-400 text-sm max-w-md">
                                Subscribe to get special offers, free tea giveaways, and updates on new arrivals.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-0">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-80 px-6 py-3.5 bg-white/10 border border-white/10 rounded-full sm:rounded-r-none text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-tea-primary transition-colors"
                            />
                            <button className="px-6 py-3.5 bg-tea-primary hover:bg-orange-500 text-white font-semibold rounded-full sm:rounded-l-none transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                                Subscribe
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-16 h-16  rounded-xl flex items-center justify-center">
                                <img src={bro} alt="" />
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight">
                                <span className="text-white">Borsillah</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Bringing tranquility to your daily ritual, one cup at a time. Premium hand-picked tea leaves from the finest gardens around the world.
                        </p>
                        <div className="flex gap-3">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-tea-primary hover:text-white transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-3">
                            {shopLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-tea-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-tea-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Get in Touch</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>support@Borsillah.com</li>
                            <li>+91 98765 43210</li>
                            <li>Mon - Sat: 9:00 AM - 6:00 PM</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Borsillah. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
