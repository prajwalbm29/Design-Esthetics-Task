import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../components/Layout/Header';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(60);
    const navigate = useNavigate();

    // Handle countdown timer
    useEffect(() => {
        let timer;
        if (resendDisabled && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0) {
            setResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [countdown, resendDisabled]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            toast.error('Email is required');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/v1/auth/generate-otp', {
                email: formData.email
            });

            if (data.success) {
                toast.success('OTP sent to your email');
                setStep(2);
                setResendDisabled(true);
                setCountdown(60);
            } else {
                toast.error(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/v1/auth/generate-otp', {
                email: formData.email
            });

            if (data.success) {
                toast.success('New OTP sent to your email');
                setResendDisabled(true);
                setCountdown(60);
            } else {
                toast.error(data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!formData.otp) {
            toast.error('OTP is required');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/v1/auth/verify-otp', {
                email: formData.email,
                otp: formData.otp
            });

            if (data.success) {
                toast.success('OTP verified successfully');
                setStep(3);
            } else {
                toast.error(data.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error(error.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!formData.password || !formData.confirmPassword) {
            toast.error('Both password fields are required');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/v1/auth/change-password', {
                email: formData.email,
                password: formData.password
            });

            if (data.success) {
                toast.success('Password reset successfully');
                navigate('/login');
            } else {
                toast.error(data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-center text-purple-400 mb-2">
                            {step === 1 ? 'Forgot Password' :
                                step === 2 ? 'Verify OTP' :
                                    'Reset Password'}
                        </h1>
                        <p className="text-gray-400 text-center mb-6">
                            {step === 1 ? 'Enter your registered email to receive OTP' :
                                step === 2 ? 'Enter the OTP sent to your email' :
                                    'Enter your new password'}
                        </p>

                        {step === 1 && (
                            <form onSubmit={handleSendOtp}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition duration-300 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending OTP...
                                        </>
                                    ) : 'Send OTP'}
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp}>
                                <div className="mb-4">
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                                        OTP Code
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        placeholder="Enter 6-digit OTP"
                                        required
                                    />
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendDisabled || loading}
                                        className="text-sm text-purple-400 hover:text-purple-300 disabled:text-gray-500"
                                    >
                                        {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition duration-300 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </>
                                    ) : 'Verify OTP'}
                                </button>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        placeholder="••••••••"
                                        minLength="6"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                        placeholder="••••••••"
                                        minLength="6"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition duration-300 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Resetting...
                                        </>
                                    ) : 'Reset Password'}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-purple-400 hover:text-purple-300 font-medium transition"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;