import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import JobCard from "../Components/JobCard"; 

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch candidate jobs
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
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

  if (loading) return <div className="text-center p-4">Loading jobs...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>

        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.uuid} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
