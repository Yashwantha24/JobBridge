import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { HiUser, HiBriefcase, HiUpload, HiDocumentText, HiCheckCircle } from 'react-icons/hi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const StudentDashboard = () => {
    const [profile, setProfile] = useState({ skills: '', education: '', experience: '' });
    const [applications, setApplications] = useState([]);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, appsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/student/profile'),
                axios.get('http://localhost:5000/api/student/applications')
            ]);
            if (profileRes.data) setProfile(profileRes.data);
            setApplications(appsRes.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/api/student/profile', profile);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if (!resume) return toast.error('Please select a file');

        const formData = new FormData();
        formData.append('resume', resume);

        try {
            await axios.post('http://localhost:5000/api/student/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Resume uploaded successfully');
            fetchData();
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <HiUser size={24} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Section */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
                        <span className="text-sm text-gray-500">Edit details</span>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <Input
                            label="Skills (comma separated)"
                            value={Array.isArray(profile.skills) ? profile.skills.join(',') : profile.skills || ''}
                            onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',') })}
                            placeholder="e.g. React, Node.js, Python"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Education</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                rows="3"
                                value={profile.education || ''}
                                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 ml-1 mb-1">Experience</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                rows="3"
                                value={profile.experience || ''}
                                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                            />
                        </div>
                        <Button type="submit">Update Profile</Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <HiDocumentText className="text-gray-400" /> Resume
                        </h3>
                        <form onSubmit={handleResumeUpload} className="flex gap-4 items-end">
                            <div className="max-w-xs">
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    className="border-0 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                            <Button type="submit" variant="outline" className="mb-[2px]">
                                <HiUpload className="inline mr-1" /> Upload
                            </Button>
                        </form>
                        {profile.resumeUrl && (
                            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                                <HiCheckCircle size={16} /> Resume on file
                            </div>
                        )}
                    </div>
                </Card>

                {/* Applications Section */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <HiBriefcase className="text-gray-400" /> Applications
                        </h2>
                        <span className="text-sm font-medium text-gray-500">{applications.length} applied</span>
                    </div>

                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50/50">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900">{app.job?.title}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>ATS Score: <span className="font-bold text-gray-900">{app.atsScore}%</span></span>
                                </div>
                                {app.missingKeywords && Array.isArray(app.missingKeywords) && app.missingKeywords.length > 0 && (
                                    <div className="mt-3 text-xs bg-red-50 text-red-600 p-2 rounded">
                                        <span className="font-semibold">Missing Skills:</span> {app.missingKeywords.join(', ')}
                                    </div>
                                )}
                            </div>
                        ))}
                        {applications.length === 0 && (
                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                No applications yet. Start applying!
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboard;
