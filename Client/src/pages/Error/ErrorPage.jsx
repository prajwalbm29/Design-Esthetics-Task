import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <p className="text-6xl font-bold text-red-500 mb-4">404</p>
        <p className="text-2xl font-semibold text-gray-100 mb-2">
          Oops! Page Not Found
        </p>
        <p className="text-gray-300 mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mx-auto"
        >
          <FaHome /> Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;