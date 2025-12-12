import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
        setIsLoggedIn(!!storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
        setIsOpen(false);
        navigate("/login");
    };

    const handleLogoClick = () => {
        if (user?.role === "company") {
            navigate("/company/joblist");
        } else if (user?.role === "candidate") {
            navigate("/candidate/JobList");
        } else {
            navigate("/");
        }
        setIsOpen(false);
    };

    const menuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, y: -10 },
        open: { opacity: 1, y: 0 }
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 text-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogoClick}
                            className="flex items-center space-x-3 cursor-pointer group"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                    CV Synk
                                </h1>
                                <p className="text-xs text-gray-400">Future of Recruitment</p>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {isLoggedIn ? (
                                <>
                                    {/* Role-based Menus */}
                                    {user.role === "candidate" && (
                                        <>
                                            <Link to="/candidate/JobList" className="group relative">
                                                <span className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>Jobs</span>
                                                </span>
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                            </Link>
                                            <Link to="/candidate/applications" className="group relative">
                                                <span className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <span>Applications</span>
                                                </span>
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                            </Link>
                                        </>
                                    )}

                                    {user.role === "company" && (
                                        <>
                                            <Link to="/candidate/jobs" className="group relative">
                                                <span className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                    <span>All Jobs</span>
                                                </span>
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                            </Link>
                                            <Link to="/company/joblist" className="group relative">
                                                <span className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                    <span>My Jobs</span>
                                                </span>
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                            </Link>
                                            <Link to="/company/jobs/create" className="group relative">
                                                <span className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    <span>Post Job</span>
                                                </span>
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                            </Link>
                                            <Link to="/company/applications" className="group relative">
                                                <span className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span>Applications</span>
                                                </span>
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                            </Link>
                                        </>
                                    )}

                                    {/* User Profile */}
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border border-gray-600">
                                                <span className="font-semibold">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="hidden md:block">
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                                            </div>
                                        </div>

                                        {/* Logout Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleLogout}
                                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </motion.button>
                                    </div>
                                </>
                            ) : (
                                // Not logged in
                                <div className="flex items-center space-x-4">
                                    <Link to="/login">
                                        <button className="px-6 py-2 border border-gray-600 rounded-xl hover:bg-gray-800 transition-colors">
                                            Login
                                        </button>
                                    </Link>
                                    <Link to="/register">
                                        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all">
                                            Register
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            {isOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                variants={menuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="lg:hidden overflow-hidden"
                            >
                                <div className="py-6 space-y-4 border-t border-gray-700 mt-4">
                                    {isLoggedIn ? (
                                        <>
                                            {/* Role-based Mobile Menus */}
                                            {user.role === "candidate" && (
                                                <motion.div variants={itemVariants} className="space-y-3">
                                                    <Link to="/candidate/JobList" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>Jobs</span>
                                                    </Link>
                                                    <Link to="/candidate/applications" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span>Applications</span>
                                                    </Link>
                                                </motion.div>
                                            )}

                                            {user.role === "company" && (
                                                <motion.div variants={itemVariants} className="space-y-3">
                                                    <Link to="/candidate/jobs" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        <span>All Jobs</span>
                                                    </Link>
                                                    <Link to="/company/joblist" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        <span>My Jobs</span>
                                                    </Link>
                                                    <Link to="/company/jobs/create" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        <span>Post Job</span>
                                                    </Link>
                                                    <Link to="/company/applications" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <span>Applications</span>
                                                    </Link>
                                                </motion.div>
                                            )}

                                            {/* User Info Mobile */}
                                            <motion.div variants={itemVariants} className="pt-4 border-t border-gray-700">
                                                <div className="flex items-center space-x-3 p-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border border-gray-600">
                                                        <span className="font-semibold">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-gray-400 capitalize">{user.role}</p>
                                                    </div>
                                                </div>
                                                <motion.button
                                                    variants={itemVariants}
                                                    onClick={handleLogout}
                                                    className="w-full mt-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-300"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span>Logout</span>
                                                </motion.button>
                                            </motion.div>
                                        </>
                                    ) : (
                                        // Not logged in - Mobile
                                        <motion.div variants={itemVariants} className="space-y-3">
                                            <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full p-3 border border-gray-600 rounded-xl hover:bg-gray-800 transition-colors text-center">
                                                Login
                                            </Link>
                                            <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all text-center">
                                                Register
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
        </>
    );
}
