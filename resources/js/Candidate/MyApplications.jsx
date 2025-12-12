import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/api/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setApplications(response.data);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = filterStatus === "all"
    ? applications
    : applications.filter(app => app.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'applied': return 'bg-blue-500/20 text-blue-400';
      case 'selected': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'shortlisted': return 'bg-purple-500/20 text-purple-400';
      case 'interview': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'applied': return '📄';
      case 'selected': return '✅';
      case 'rejected': return '❌';
      case 'shortlisted': return '⭐';
      case 'interview': return '📅';
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 text-xl mb-2">Error</p>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={fetchApplications}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all"
            >
              Retry
            </button>
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              My Applications
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Track the status of your job applications and updates
            </p>
          </motion.div>

          {/* Stats & Filters */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-300">Application Status</h2>
                  <p className="text-sm text-gray-500 mt-1">{applications.length} total applications</p>
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 rounded-xl transition-all ${filterStatus === "all" ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    All ({applications.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("applied")}
                    className={`px-4 py-2 rounded-xl transition-all ${filterStatus === "applied" ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    Applied ({applications.filter(app => app.status === 'applied').length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("shortlisted")}
                    className={`px-4 py-2 rounded-xl transition-all ${filterStatus === "shortlisted" ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    Shortlisted ({applications.filter(app => app.status === 'shortlisted').length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("selected")}
                    className={`px-4 py-2 rounded-xl transition-all ${filterStatus === "selected" ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    Selected ({applications.filter(app => app.status === 'selected').length})
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {applications.filter(app => app.status === 'applied').length}
                  </div>
                  <div className="text-sm text-gray-400">Applied</div>
                </div>
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {applications.filter(app => app.status === 'shortlisted').length}
                  </div>
                  <div className="text-sm text-gray-400">Shortlisted</div>
                </div>
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {applications.filter(app => app.status === 'selected').length}
                  </div>
                  <div className="text-sm text-gray-400">Selected</div>
                </div>
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {applications.filter(app => app.status === 'interview').length}
                  </div>
                  <div className="text-sm text-gray-400">Interview</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Applications List */}
          <motion.div variants={itemVariants}>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  {filterStatus === 'all' ? 'No applications yet' : `No ${filterStatus} applications`}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {filterStatus === 'all'
                    ? "You haven't applied to any jobs yet. Start applying to track your progress here."
                    : `You don't have any ${filterStatus} applications. Try changing the filter.`
                  }
                </p>
                {filterStatus !== 'all' && (
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all"
                  >
                    View All Applications
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-300">
                    {filterStatus === 'all' ? 'All Applications' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                    <span className="text-blue-400 ml-2">({filteredApplications.length})</span>
                  </h2>
                  <div className="text-sm text-gray-400">
                    Showing {filteredApplications.length} applications
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredApplications.map((app, index) => (
                    <motion.div
                      key={app.uuid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300"
                    >
                      {/* Status Indicator */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                          <span className="mr-1">{getStatusIcon(app.status)}</span>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>

                      {/* Job Info */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                          {app.job ? app.job.title : "Job not found"}
                        </h3>
                        {app.job?.company && (
                          <p className="text-gray-400 text-sm mt-1">
                            {app.job.company.name}
                          </p>
                        )}
                      </div>

                      {/* Job Description */}
                      <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                        {app.job ? app.job.description : "No description available"}
                      </p>

                      {/* Job Details */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-gray-500">Salary</p>
                          <p className="text-sm font-semibold text-white">
                            ₹{app.job ? app.job.salary_from : "N/A"} - ₹{app.job ? app.job.salary_to : "N/A"}
                          </p>
                        </div>
                        {app.job?.location && (
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-semibold text-white">
                              {app.job.location}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Application Details */}
                      <div className="pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-gray-500">Applied on</p>
                            <p className="text-white">
                              {new Date(app.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {app.updated_at !== app.created_at && (
                            <div className="text-right">
                              <p className="text-gray-500">Last updated</p>
                              <p className="text-white">
                                {new Date(app.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
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
};

export default MyApplications;
