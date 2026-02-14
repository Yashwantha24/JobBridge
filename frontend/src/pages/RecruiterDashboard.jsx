import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { HiBriefcase, HiUserGroup, HiPlus, HiSearch } from 'react-icons/hi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [newJob, setNewJob] = useState({
        title: '', description: '', location: '', salary: '', jobType: 'Full-time', skillsRequired: ''
    });
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/recruiter/jobs`);
            setJobs(res.data);
        } catch (error) {
            console.error('Error fetching jobs', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs`, newJob);
            setNewJob({ title: '', description: '', location: '', salary: '', jobType: 'Full-time', skillsRequired: '' });
            fetchMyJobs();
            toast.success('Job Posted Successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to post job');
        }
    };

    const fetchApplications = async (jobId) => {
        setSelectedJobId(jobId);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/recruiter/applications/${jobId}`);
            setApplications(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load applications');
        }
    };

    const updateStatus = async (appId, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/recruiter/application/${appId}/status`, { status });
            toast.success(`Application ${status}`);
            if (selectedJobId) fetchApplications(selectedJobId);
        } catch (error) {
            console.error(error);
            toast.error('Update failed');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <HiBriefcase size={24} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Post Job Section */}
                <Card>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <HiPlus />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Post a New Job</h2>
                    </div>

                    <form onSubmit={handleCreateJob} className="space-y-4">
                        <Input
                            placeholder="Job Title"
                            required
                            value={newJob.title}
                            onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Job Description"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            rows="3"
                            required
                            value={newJob.description}
                            onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="Location"
                                value={newJob.location}
                                onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                            />
                            <Input
                                placeholder="Salary"
                                value={newJob.salary}
                                onChange={e => setNewJob({ ...newJob, salary: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Job Type</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    value={newJob.jobType}
                                    onChange={e => setNewJob({ ...newJob, jobType: e.target.value })}
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Internship</option>
                                    <option>Contract</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 ml-1">Required Skills</label>
                                <Input
                                    placeholder="Comma separated"
                                    required
                                    value={newJob.skillsRequired}
                                    onChange={e => setNewJob({ ...newJob, skillsRequired: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full flex items-center justify-center gap-2">
                            <HiPlus /> Post Job
                        </Button>
                    </form>
                </Card>

                {/* Manage Jobs Section */}
                <div className="space-y-6">
                    <Card className="max-h-[500px] flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <HiBriefcase />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">My Jobs</h2>
                        </div>

                        <div className="space-y-2 overflow-y-auto pr-2 flex-grow custom-scrollbar">
                            {jobs.map(job => (
                                <div key={job.id}
                                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedJobId === job.id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}
                                    onClick={() => fetchApplications(job.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">{job.title}</span>
                                        <span className="text-xs text-indigo-600 font-medium bg-indigo-100 px-2 py-1 rounded-full">View Applicants</span>
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                                        <span>{job.location}</span>
                                        <span>{job.jobType}</span>
                                    </div>
                                </div>
                            ))}
                            {jobs.length === 0 && <p className="text-center text-gray-500 py-4">No jobs posted yet.</p>}
                        </div>
                    </Card>

                    {/* Applicants List */}
                    {selectedJobId && (
                        <Card>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <HiUserGroup />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Applicants</h3>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {applications.map(app => (
                                    <div key={app.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-gray-900">{app.student?.name}</p>
                                                <p className="text-sm text-gray-500">{app.student?.email}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${app.atsScore > 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {app.atsScore}% Match
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                                            <a href={`${import.meta.env.VITE_API_URL}/${app.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm font-medium hover:underline">
                                                View Resume
                                            </a>
                                            <div className="flex-grow"></div>
                                            {app.status === 'applied' ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => updateStatus(app.id, 'shortlisted')} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">Shortlist</button>
                                                    <button onClick={() => updateStatus(app.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">Reject</button>
                                                </div>
                                            ) : (
                                                <span className={`text-sm font-bold uppercase ${app.status === 'shortlisted' ? 'text-green-600' : 'text-red-600'
                                                    }`}>{app.status}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {applications.length === 0 && <p className="text-center text-gray-500 py-8">No applicants yet.</p>}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
