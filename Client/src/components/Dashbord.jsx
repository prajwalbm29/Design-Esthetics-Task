import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../constants/baseUrl';

const Dashbord = () => {
    const { auth } = useContext(AuthContext);
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-blue-400">User Profile</h1>

                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500">
                            <img
                                src={`${BASE_URL}/api/v1/auth/user-photo/${user._id}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold mb-2">{user?.name || 'No name provided'}</h2>
                            <p className="text-gray-400 mb-1">{user?.email || 'No email provided'}</p>
                            <p className="text-gray-400">{user?.phone || 'No phone number provided'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="border-b border-gray-700 pb-4">
                            <h3 className="text-lg font-medium text-blue-300 mb-2">Personal Information</h3>
                            <p className="text-gray-300">
                                <span className="font-medium">Full Name:</span> {user?.name || 'Not specified'}
                            </p>
                        </div>

                        <div className="border-b border-gray-700 pb-4">
                            <h3 className="text-lg font-medium text-blue-300 mb-2">Contact Details</h3>
                            <p className="text-gray-300">
                                <span className="font-medium">Email:</span> {user?.email || 'Not specified'}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-medium">Phone:</span> {user?.phone || 'Not specified'}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-blue-300 mb-2">Address</h3>
                            <p className="text-gray-300">
                                {user?.address || 'No address provided'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashbord;