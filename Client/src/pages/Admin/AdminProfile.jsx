import { useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiLogOut, FiLock, FiUser, FiMail, FiMapPin } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const AdminProfile = () => {
  const { auth, logout, updateAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    address: auth.user?.address || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        email: formData.email,
        name: formData.name,
        address: formData.address,
        ...(formData.password && { password: formData.password })
      };

      const { data } = await axios.put('/api/v1/auth/update-profile', updateData);

      if (data.success) {
        toast.success('Profile updated successfully');
        updateAuth(data.user);
        setIsEditing(false);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData({
        name: auth.user?.name || '',
        email: auth.user?.email || '',
        address: auth.user?.address || '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-purple-400 flex items-center">
              <FiUser className="mr-3" />
              My Profile
            </h1>
            <button
              onClick={toggleEdit}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isEditing ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'} transition-colors`}
            >
              {isEditing ? (
                <>
                  <FiSave /> Cancel
                </>
              ) : (
                <>
                  <FiEdit2 /> Edit Profile
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div className="flex items-start gap-4">
                <div className="pt-3">
                  <FiUser className="text-xl text-purple-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-700 rounded-lg">{auth.user?.name}</p>
                  )}
                </div>
              </div>

              {/* Email Field (read-only) */}
              <div className="flex items-start gap-4">
                <div className="pt-3">
                  <FiMail className="text-xl text-purple-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <p className="px-4 py-2 bg-gray-700 rounded-lg">{auth.user?.email}</p>
                </div>
              </div>

              {/* Address Field */}
              <div className="flex items-start gap-4">
                <div className="pt-3">
                  <FiMapPin className="text-xl text-purple-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-700 rounded-lg">
                      {auth.user?.address || 'No address provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Fields (only show when editing) */}
              {isEditing && (
                <>
                  <div className="flex items-start gap-4">
                    <div className="pt-3">
                      <FiLock className="text-xl text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Leave blank to keep current"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="pt-3">
                      <FiLock className="text-xl text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Leave blank to keep current"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              {isEditing && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave /> Save Changes
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={logout}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;