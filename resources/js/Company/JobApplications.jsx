import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function JobApplications() {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        applied: 0,
        selected: 0,
        rejected: 0
    });

    const [searchCandidate, setSearchCandidate] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchJob, setSearchJob] = useState("");

    const token = localStorage.getItem("token");

    const fetchApplications = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/applications/received",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const apps = Array.isArray(response.data) ? response.data : [];
            setApplications(apps);
            setFilteredApplications(apps);
            calculateStats(apps);
        } catch (error) {
            console.error("Error fetching applications:", error.response?.data);
            setApplications([]);
            setFilteredApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (apps) => {
        const stats = {
            total: apps.length,
            applied: apps.filter(app => app.status === "applied").length,
            selected: apps.filter(app => app.status === "selected").length,
            rejected: apps.filter(app => app.status === "rejected").length
        };
        setStats(stats);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...applications];

        // Search candidate by name/email
        if (searchCandidate) {
            filtered = filtered.filter(app =>
                app.candidate?.name?.toLowerCase().includes(searchCandidate.toLowerCase()) ||
                app.candidate?.email?.toLowerCase().includes(searchCandidate.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        // Search job by title
        if (searchJob) {
            filtered = filtered.filter(app =>
                app.job?.title?.toLowerCase().includes(searchJob.toLowerCase())
            );
        }

        setFilteredApplications(filtered);
    }, [searchCandidate, statusFilter, searchJob, applications]);

    const updateStatus = async (uuid, action) => {
        const newStatus = action === "select" ? "selected" : "rejected";
        const confirmMessage = action === "select"
            ? "Are you sure you want to select this candidate?"
            : "Are you sure you want to reject this candidate?";

        if (!window.confirm(confirmMessage)) return;

        try {
            await axios.put(
                `http://127.0.0.1:8000/api/applications/${uuid}/${action}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setApplications(prev =>
                prev.map(app =>
                    app.uuid === uuid
                        ? { ...app, status: newStatus }
                        : app
                )
            );

            // Update filtered applications too
            setFilteredApplications(prev =>
                prev.map(app =>
                    app.uuid === uuid
                        ? { ...app, status: newStatus }
                        : app
                )
            );

            // Recalculate stats
            calculateStats(applications.map(app =>
                app.uuid === uuid ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error("Failed:", error.response?.data);
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'applied': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            case 'selected': return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'rejected': return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'applied': return '📄';
            case 'selected': return '✅';
            case 'rejected': return '❌';
            default: return '📋';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="mt-4 text-gray-400">Loading applications...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Applications Received
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Review and manage candidate applications for your job postings
                        </p>
                    </motion.div>

                    {/* Stats Dashboard */}
                    <motion.div variants={itemVariants} className="mb-10">
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-gray-300 mb-6">Application Overview</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-purple-400">{stats.total}</div>
                                    <div className="text-sm text-gray-400">Total Applications</div>
                                </div>
                                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-blue-400">{stats.applied}</div>
                                    <div className="text-sm text-gray-400">New Applications</div>
                                </div>
                                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-green-400">{stats.selected}</div>
                                    <div className="text-sm text-gray-400">Selected</div>
                                </div>
                                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
                                    <div className="text-sm text-gray-400">Rejected</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Filters Section */}
                    <motion.div variants={itemVariants} className="mb-10">
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-gray-300 mb-6">Filter Applications</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Candidate Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Search Candidate
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Name or email..."
                                            value={searchCandidate}
                                            onChange={(e) => setSearchCandidate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Application Status
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="applied">Applied</option>
                                        <option value="selected">Selected</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>

                                {/* Job Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Search Job
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Job title..."
                                            value={searchJob}
                                            onChange={(e) => setSearchJob(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Reset Button */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setSearchCandidate("");
                                        setStatusFilter("all");
                                        setSearchJob("");
                                    }}
                                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Applications List */}
                    <motion.div variants={itemVariants}>
                        {filteredApplications.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                    No applications found
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    {applications.length === 0
                                        ? "You haven't received any applications yet."
                                        : "Try adjusting your filters or search criteria."
                                    }
                                </p>
                                {applications.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setSearchCandidate("");
                                            setStatusFilter("all");
                                            setSearchJob("");
                                        }}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                                    >
                                        Reset All Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-300">
                                        Candidate Applications
                                        <span className="text-purple-400 ml-2">({filteredApplications.length})</span>
                                    </h2>
                                    <div className="text-sm text-gray-400">
                                        Showing {filteredApplications.length} of {applications.length} applications
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredApplications.map((app, index) => (
                                        <motion.div
                                            key={app.uuid}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300"
                                        >
                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                                    <span className="mr-1">{getStatusIcon(app.status)}</span>
                                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                </span>
                                            </div>

                                            {/* Job Info */}
                                            <div className="mb-4">
                                                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                                                    {app.job?.title || "Unknown Job"}
                                                </h3>
                                                <div className="flex items-center mt-2 text-sm text-gray-400">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Applied {new Date(app.created_at).toLocaleDateString()}
                                                </div>
                                            </div>

                                            {/* Candidate Info */}
                                            <div className="mb-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                                                        <span className="font-semibold text-purple-300">
                                                            {app.candidate?.name?.charAt(0).toUpperCase() || "?"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-white">{app.candidate?.name || "N/A"}</h4>
                                                        <p className="text-sm text-gray-400">{app.candidate?.email || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Candidate Details */}
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                {app.candidate?.skills && (
                                                    <div>
                                                        <p className="text-xs text-gray-500">Skills</p>
                                                        <p className="text-sm font-medium text-white truncate">
                                                            {app.candidate.skills}
                                                        </p>
                                                    </div>
                                                )}
                                                {app.job?.salary_from && app.job?.salary_to && (
                                                    <div>
                                                        <p className="text-xs text-gray-500">Job Salary</p>
                                                        <p className="text-sm font-medium text-white">
                                                            ₹{app.job.salary_from} - ₹{app.job.salary_to}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-3">
                                                {app.resume_url && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={app.resume_url}
                                                        download
                                                        className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-medium transition-all duration-300 group"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span>Resume</span>
                                                    </motion.a>
                                                )}
                                                {app.status !== "selected" && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => updateStatus(app.uuid, "select")}
                                                        className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-medium transition-all duration-300"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>Select</span>
                                                    </motion.button>
                                                )}
                                                {app.status !== "rejected" && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => updateStatus(app.uuid, "reject")}
                                                        className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl font-medium transition-all duration-300"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        <span>Reject</span>
                                                    </motion.button>
                                                )}
                                            </div>

                                            {/* Already Selected/Rejected */}
                                            {(app.status === "selected" || app.status === "rejected") && (
                                                <div className="mt-4 pt-4 border-t border-gray-700 text-center">
                                                    <p className="text-sm text-gray-400">
                                                        Candidate has been {app.status}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
