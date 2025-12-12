import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const JobCard = ({ job }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(job.applied || false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isCompany = user?.role === "company";

  const handleApply = async () => {
    if (applied) return;

    const confirmApply = window.confirm(`Do you want to apply for "${job.title}"?`);
    if (!confirmApply) return;

    setIsApplying(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://127.0.0.1:8000/api/jobs/${job.uuid}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      alert("Applied successfully!");
      setApplied(true);
    } catch (err) {
      console.error(err);
      alert("Failed to apply. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors">
              {job.title}
            </h2>
            {job.company && (
              <p className="text-gray-400 text-sm mt-1">
                {job.company.name}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            job.status === "active"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}>
            {job.status === "active" ? "Active" : "Closed"}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-6 line-clamp-3">
          {job.description}
        </p>

        {/* Job Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Salary */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Salary</p>
              <p className="text-sm font-semibold text-white">
                ₹{job.salary_from} - ₹{job.salary_to}
              </p>
            </div>
          </div>

          {/* Job Type */}
          {job.job_type && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm font-semibold text-white capitalize">
                  {job.job_type.replace('-', ' ')}
                </p>
              </div>
            </div>
          )}

          {/* Location */}
          {job.location && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-semibold text-white">
                  {job.location}
                </p>
              </div>
            </div>
          )}

          {/* Posted Date */}
          {job.created_at && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Posted</p>
                <p className="text-sm font-semibold text-white">
                  {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Apply Button - Hidden for company users */}
        {!isCompany && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApply}
            disabled={isApplying || applied || job.status !== "active"}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
              applied
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : job.status !== "active"
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-green-500/25"
            }`}
          >
            {isApplying ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Applying...</span>
              </>
            ) : applied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Applied ✓</span>
              </>
            ) : job.status !== "active" ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Position Closed</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Apply Now</span>
              </>
            )}
          </motion.button>
        )}

        {/* Company View Only */}
        {isCompany && (
          <div className="text-center py-3 border-t border-gray-700 mt-4">
            <p className="text-sm text-gray-400">This is your posted job</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;
