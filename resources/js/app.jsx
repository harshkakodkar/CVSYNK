import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import RegisterCompany from "./Pages/RegisterCompany";
import RegisterCandidate from "./Pages/RegisterCandidate";

import JobList from "./Company/JobList";
import JobList2 from "./Candidate/JobList";
import JobCard3 from "./Components/ApplyjobCard";
import JobCreate from "./Company/JobCreate";
import JobEdit from "./Company/JobEdit";

import MyApplications from "./Candidate/MyApplications";
import JobApplications from "./Company/JobApplications";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/register/company" element={<RegisterCompany />} />
                <Route path="/register/candidate" element={<RegisterCandidate />} />

                <Route path="/login" element={<Login />} />

                <Route path="Company/JobList" element={<JobList />} />
                <Route path="candidate/jobs" element={<JobList2 />} />
                <Route path="candidate/JobList" element={<JobList2 />} />

                <Route path="company/jobs/create" element={<JobCreate />} />

                <Route path="candidate/applications" element={<MyApplications />} />
                <Route path="company/applications" element={<JobApplications />} />


                <Route path="company/jobs/:uuid/edit" element={<JobEdit />} />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
