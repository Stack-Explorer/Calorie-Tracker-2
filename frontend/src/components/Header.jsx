import { useSelector, useDispatch } from "react-redux";
import { logoutUser, deleteUsersWholeData } from "../store/features/backendSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmation from "./DeleteConfirmation";
import UpdateUser from "./UpdateUser";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [toggleEditProfile, setToggleEditProfile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const userData = useSelector((state) => state.backend.data);
  const { username, email } = userData || {};
  const isOnHistoryPage = location.pathname === "/datewisedata";
  const isOnCalorieBurntHistory = location.pathname === "/calorieburntdata";

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      dispatch(logoutUser());
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const handleHistoryButton = () => {
    navigate(isOnHistoryPage ? "/" : "/datewisedata");
  };

  const handleCalorieBurntHistoryButton = () => {
    navigate(isOnCalorieBurntHistory ? "/" : "/calorieburntdata");
  };

  const handleDeleteUser = async (userGivenPassword) => {
    if (!userGivenPassword.trim()) return toast.error("Password is required!");

    dispatch(deleteUsersWholeData({ userGivenPassword }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Account deleted successfully");
        setShowDeleteModal(false);
        window.location.href = "/signup";
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to delete account");
      });
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Branding and User Info */}
            <div className="flex items-center space-x-4">
              <h1
                onClick={() => navigate("/")}
                className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              >
                Calorie Tracker
              </h1>

              {userData && (
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold">{username}</span>
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                    {email}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {!userData ? (
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 pointer py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium transition-colors"
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    onClick={handleHistoryButton}
                    className={`px-4 pointer py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isOnHistoryPage
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500"
                        : "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
                      }`}
                  >
                    {isOnHistoryPage ? (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Calorie History
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleCalorieBurntHistoryButton}
                    className={`px-4 pointer py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isOnCalorieBurntHistory
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500"
                        : "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500"
                      }`}
                  >
                    {isOnCalorieBurntHistory ? (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Cal Burnt History
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setToggleEditProfile(!toggleEditProfile)}
                    className={`px-4 pointer py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${toggleEditProfile
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500"
                        : "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500"
                      }`}
                  >
                    {toggleEditProfile ? "Cancel" : "Edit Profile"}
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 pointer py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium transition-colors"
                  >
                    Delete Account
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-4 pointer py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile User Info */}
          {userData && (
            <div className="mt-2 sm:hidden">
              <p className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{username}</span>
              </p>
              <p className="text-xs text-gray-500 truncate">
                {email}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Modal for delete */}
      {showDeleteModal && (
        <DeleteConfirmation
          username={username}
          onConfirm={handleDeleteUser}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Edit Profile Form */}
      {userData && toggleEditProfile && <UpdateUser />}
    </>
  );
};

export default Header;