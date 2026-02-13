import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiLocationMarker, HiCurrencyDollar, HiBriefcase } from 'react-icons/hi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filteredJobs, setFilteredJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/jobs');
                setJobs(res.data.jobs || []);
                setFilteredJobs(res.data.jobs || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const results = jobs.filter(job => {
            const titleMatch = job.title?.toLowerCase().includes(search.toLowerCase());
            const skillsMatch = typeof job.skillsRequired === 'string'
                ? job.skillsRequired.toLowerCase().includes(search.toLowerCase())
                : false;
            return titleMatch || skillsMatch;
        });
        setFilteredJobs(results);
    }, [search, jobs]);

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12 md:py-20">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900"
                >
                    Find Your <span className="text-gradient">Dream Job</span> <br />
                    Build Your Future
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-gray-600 max-w-2xl mx-auto"
                >
                    Connect with top companies and startups. Your next career move fits you perfectly.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-xl mx-auto relative group"
                >
                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-white rounded-full shadow-lg p-2 flex items-center gap-2 border border-gray-100">
                        <HiSearch className="text-gray-400 ml-4" size={20} />
                        <input
                            type="text"
                            placeholder="Job title, skills, or company..."
                            className="flex-grow px-2 py-2 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button className="rounded-full px-8">Search</Button>
                    </div>
                </motion.div>
            </section>

            {/* Jobs Grid */}
            <section className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Latest Opportunities</h2>
                    <span className="text-gray-500 font-medium">{filteredJobs.length} jobs found</span>
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map((job, index) => (
                            <Link key={job.id} to={`/jobs/${job.id}`}>
                                <Card hover className="h-full flex flex-col justify-between group">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <HiBriefcase size={24} />
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                {job.jobType}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                <HiLocationMarker />
                                                {job.location}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {job.description}
                                        </p>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-center">
                                        <div className="flex items-center gap-1 text-gray-900 font-semibold">
                                            <HiCurrencyDollar className="text-gray-400" />
                                            {job.salary}
                                        </div>
                                        <span className="text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                            Apply Now &rarr;
                                        </span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
