import { Navigate, Outlet } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoadingPage from '../pages/LoadingPage';

const ProtectedRoute = ({ adminOnly = false }) => {
    const { isAuthenticated, isAdmin } = useContext(AuthContext);
    const [isVerified, setIsVerified] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            const authCheck = await isAuthenticated();
            if (!authCheck) {
                setIsVerified(false);
                return;
            }
            
            if (adminOnly) {
                const adminCheck = await isAdmin();
                setIsVerified(adminCheck);
            } else {
                setIsVerified(true);
            }
        };

        verifyAuth();
    }, [isAuthenticated, isAdmin, adminOnly]);

    if (isVerified === null) {
        return <LoadingPage />;
    }

    if (!isVerified) {
        return <Navigate to={"/login"} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

