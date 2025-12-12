import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import JobCard from "../Components/ApplyjobCard";
import { motion } from "framer-motion";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTitle, setSearchTitle] = useState("");
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" });

  const token = localStorage.getItem("token");

  // Fetch candidate jobs
  const fetchJobs = async () => {
    try {
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/api/candidate/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load jobs. Please check your login or API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...jobs];

    // Search by job title
    if (searchTitle) {
      filtered = filtered.filter((job) =>
        job.title?.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Filter by salary range
    if (salaryRange.min || salaryRange.max) {
      filtered = filtered.filter((job) => {
        const salaryFrom = parseFloat(job.salary_from) || 0;
        const salaryTo = parseFloat(job.salary_to) || 0;
        const min = parseFloat(salaryRange.min) || 0;
        const max = parseFloat(salaryRange.max) || Infinity;
        return salaryFrom >= min && salaryTo <= max;
      });
    }

    setFilteredJobs(filtered);
  }, [searchTitle, salaryRange, jobs]);

  const handleResetFilters = () => {
    setSearchTitle("");
    setSalaryRange({ min: "", max: "" });
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-400">Loading available jobs...</p>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Available Jobs
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Browse and apply to jobs that match your skills
            </p>
          </motion.div>

          {/* Filters Section */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-300 mb-4 md:mb-0">Search Jobs</h2>
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Job Title Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Job Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search job title..."
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Salary Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min Salary"
                      value={salaryRange.min}
                      onChange={(e) =>
                        setSalaryRange((prev) => ({ ...prev, min: e.target.value }))
                      }
                      className="w-1/2 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Max Salary"
                      value={salaryRange.max}
                      onChange={(e) =>
                        setSalaryRange((prev) => ({ ...prev, max: e.target.value }))
                      }
                      className="w-1/2 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="flex items-center justify-center">
                  <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 w-full">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{filteredJobs.length}</div>
                      <div className="text-sm text-gray-400">Jobs Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Jobs List */}
          <motion.div variants={itemVariants}>
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No jobs found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Try adjusting your search criteria or reset the filters
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-300">
                    Job Opportunities
                    <span className="text-green-400 ml-2">({filteredJobs.length})</span>
                  </h2>
                  <div className="text-sm text-gray-400">
                    Showing {filteredJobs.length} of {jobs.length} jobs
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.uuid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      {filteredJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all hover:shadow-green-500/25"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default JobList;
