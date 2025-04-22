import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
import ErrorPage from '../pages/Error/ErrorPage';
import ProtectedRoute from '../utils/ProtectedRoute';
import HomePage from '../pages/HomePage';
import AdminDashboard from '../pages/Admin/AdminDashbord';
import UserProfile from '../components/UserProfile';
import CreateUser from '../pages/Admin/CreateUser';
import UserManagement from '../pages/Admin/UserManagment';
import UserLayout from '../components/UserLayout';
import RegisterPage from '../pages/Auth/RegisterPage';
import Dashbord from '../components/Dashbord';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import AdminLayout from '../pages/Admin/AdminLayout';
import AdminProfile from '../pages/Admin/AdminProfile';

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/user",
        element: <ProtectedRoute />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <UserLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashbord/>,
                    },
                    {
                        path: "profile",
                        element: <UserProfile />,
                    }
                ]
            },
        ]
    },
    {
        path: "/admin",
        element: <ProtectedRoute adminOnly={true} />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <AdminDashboard />,
                    },
                    {
                        path: "admin-profile",
                        element: <AdminProfile />
                    },
                    {
                        path: "create-user",
                        element: <CreateUser />,
                    },
                    {
                        path: "user-management",
                        element: <UserManagement />,
                    }
                ]
            },
        ]
    },
    {
        path: "/change-password",
        element: <ForgotPasswordPage />,
    }
]);

export default router;