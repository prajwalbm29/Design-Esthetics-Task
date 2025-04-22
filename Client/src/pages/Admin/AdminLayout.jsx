import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiGrid, FiUser, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import Header from '../../components/Layout/Header';

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <button
        className="md:hidden fixed top-24 left-4 z-50 bg-gray-900 p-2 rounded-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <FiMenu className="text-xl" />
      </button>

      <div className="grid grid-cols-12 pt-16">
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block col-span-12 md:col-span-3 bg-gray-800 p-4 fixed md:static h-full z-40`}>
          <nav className="space-y-2 mt-4">
            <NavLink
              style={{ textDecoration: 'none' }}
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-gray-700 text-blue-400 font-medium'
                  : 'hover:bg-gray-700'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiGrid className="text-lg" />
              <span>Admin Dashbord</span>
            </NavLink>

            <NavLink
              style={{ textDecoration: 'none' }}
              to="/admin/admin-profile"
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-gray-700 text-blue-400 font-medium'
                  : 'hover:bg-gray-700'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiUser className="text-lg" />
              <span>Admin Profile</span>
            </NavLink>

            <NavLink
              style={{ textDecoration: 'none' }}
              to="/admin/create-user"
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-gray-700 text-blue-400 font-medium'
                  : 'hover:bg-gray-700'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiUser className="text-lg" />
              <span>Create User</span>
            </NavLink>
            
            <NavLink
              style={{ textDecoration: 'none' }}
              to="/admin/user-management"
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-gray-700 text-blue-400 font-medium'
                  : 'hover:bg-gray-700'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiUser className="text-lg" />
              <span>Manage User</span>
            </NavLink>
          </nav>
        </div>

        <div className="col-span-12 md:col-span-9 md:col-start-4 p-4">
          <div className="rounded-lg p-6 min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;