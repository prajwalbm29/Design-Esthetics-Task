import React, { useContext, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../constants/baseUrl";

const Header = () => {
    const { auth, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleDashboardClick = async (isMobile = false) => {
        closeMobileMenu();
        
        try {
            setIsCheckingAdmin(true);
            const adminStatus = await isAdmin();
            
            if (adminStatus) {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            if (isMobile) {
                navigate("/login");
            } else {
                navigate("/user");
            }
        } finally {
            setIsCheckingAdmin(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-gray-900 shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className="flex items-center text-yellow-400 hover:text-yellow-300 font-bold text-2xl no-underline gap-4"
                            aria-label="Home"
                            onClick={closeMobileMenu}
                        >
                            <img src="/esthetics.jfif" width={50} className="rounded-full" />
                            Design Esthetics
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-6">
                            <NavLink
                                to="/"
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-md text-lg font-medium no-underline ${
                                        isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`
                                }
                                end
                            >
                                Home
                            </NavLink>

                            {!auth?.user ? (
                                <>
                                    <NavLink
                                        to="/register"
                                        onClick={closeMobileMenu}
                                        className={({ isActive }) =>
                                            `px-4 py-3 rounded-md text-lg font-medium no-underline ${
                                                isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                            }`
                                        }
                                    >
                                        Register
                                    </NavLink>
                                    <NavLink
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className={({ isActive }) =>
                                            `px-4 py-3 rounded-md text-lg font-medium no-underline ${
                                                isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                            }`
                                        }
                                    >
                                        Login
                                    </NavLink>
                                </>
                            ) : (
                                <div className="relative ml-6">
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <button
                                                className="flex items-center text-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white no-underline"
                                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                            >
                                                <span className="sr-only">Open user menu</span>
                                                <img 
                                                    src={`${BASE_URL}/api/v1/auth/user-photo/${auth?.user?._id}`} 
                                                    alt="Profile" 
                                                    width={40} 
                                                    className="rounded-full" 
                                                />
                                                <span className="ml-3 text-gray-300 hover:text-white text-lg">
                                                    {auth?.user?.name || "Account"}
                                                </span>
                                            </button>

                                            {isMobileMenuOpen && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <button
                                                        onClick={() => handleDashboardClick()}
                                                        className="block w-full text-left px-4 py-3 text-lg text-gray-300 hover:bg-gray-700 no-underline"
                                                    >
                                                        {isCheckingAdmin ? "Loading..." : "Dashboard"}
                                                    </button>
                                                    <div className="border-t border-gray-700"></div>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full text-left px-4 py-3 text-lg text-red-400 hover:bg-gray-700 no-underline"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMobileMenuOpen ? (
                                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
                            <NavLink
                                to="/"
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-md text-xl font-medium no-underline ${
                                        isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`
                                }
                                end
                            >
                                Home
                            </NavLink>

                            {!auth?.user ? (
                                <>
                                    <NavLink
                                        to="/register"
                                        onClick={closeMobileMenu}
                                        className={({ isActive }) =>
                                            `block px-4 py-3 rounded-md text-xl font-medium no-underline ${
                                                isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                            }`
                                        }
                                    >
                                        Register
                                    </NavLink>
                                    <NavLink
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className={({ isActive }) =>
                                            `block px-4 py-3 rounded-md text-xl font-medium no-underline ${
                                                isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                            }`
                                        }
                                    >
                                        Login
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleDashboardClick(true)}
                                        className="block w-full text-left px-4 py-3 rounded-md text-xl font-medium text-gray-300 hover:text-white hover:bg-gray-700 no-underline"
                                    >
                                        {isCheckingAdmin ? "Loading..." : "Dashboard"}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-3 rounded-md text-xl font-medium text-red-400 hover:text-white hover:bg-gray-700 no-underline"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;