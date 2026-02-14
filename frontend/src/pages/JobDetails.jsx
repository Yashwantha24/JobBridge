import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { HiLocationMarker, HiCurrencyDollar, HiBriefcase, HiCheckCircle } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`);
                setJob(res.data);
            } catch (err) {
                toast.error('Failed to load job details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            toast.error('Please login to apply');
            return navigate('/login');
        }
        if (user.role !== 'student') {
            return toast.error('Only students can apply');
        }

        setApplying(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/student/apply`, { jobId: id });
            toast.success('Application submitted successfully!');
        } catch (error) {
            console.error('Apply Error:', error);
            const message = error.response?.data?.message || 'Application failed';

            if (message.toLowerCase().includes('resume')) {
                const shouldRedirect = window.confirm(`${message}\n\nWould you like to go to the Dashboard to upload one now?`);
                if (shouldRedirect) {
                    navigate('/student/dashboard');
                }
            } else {
                toast.error(message);
            }
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="container mx-auto px-4 py-8 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
    );

    if (!job) return <div className="text-center py-20 text-gray-500">Job not found</div>;

    const skills = typeof job.skillsRequired === 'string'
        ? job.skillsRequired.split(',')
        : job.skillsRequired;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Card className="max-w-4xl mx-auto overflow-hidden">
                <div className="p-8 md:p-10 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                            <div className="flex flex-wrap gap-4 text-gray-500 font-medium">
                                <span className="flex items-center gap-1"><HiBriefcase className="text-indigo-500" /> {job.companyName || 'Company'}</span>
                                <span className="flex items-center gap-1"><HiLocationMarker className="text-indigo-500" /> {job.location}</span>
                                <span className="flex items-center gap-1"><HiCurrencyDollar className="text-indigo-500" /> {job.salary}</span>
                            </div>
                        </div>
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-semibold rounded-full border border-indigo-100">
                            {job.jobType}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About the Role</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Requirements</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Action */}
                    <div className="pt-8 border-t border-gray-100 flex justify-end">
                        <Button
                            size="lg"
                            className="w-full md:w-auto px-10 py-3 text-lg shadow-xl shadow-indigo-500/20"
                            onClick={handleApply}
                            disabled={applying}
                        >
                            {applying ? 'Applying...' : 'Apply Now'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default JobDetails;
