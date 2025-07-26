import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = ({setIsNotFoundActive}) => {
  const navigate = useNavigate();

  useEffect(() => {
    setIsNotFoundActive(true)
  
    return () => setIsNotFoundActive(false)
  }, [])
  
    return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center">
        404
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-600 text-center mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-5 py-2 rounded-xl text-white text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;