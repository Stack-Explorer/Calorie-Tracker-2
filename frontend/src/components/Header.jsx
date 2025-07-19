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

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/");
  };

  const handleHistoryButton = () => {
    navigate(isOnHistoryPage ? "/" : "/datewisedata");
  };

  const handleDeleteUser = async (userGivenPassword) => {
    if (!userGivenPassword.trim()) return toast.error("Password is required!");

    dispatch(deleteUsersWholeData({ userGivenPassword }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Account deleted successfully");
        setShowDeleteModal(false);
        navigate("/signup");
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to delete account");
      });
  };

  return (
    <>
      <header className="bg-gray-50 shadow-sm border-b border-gray-100 px-6 mx-4 md:mx-6 lg:mx-10 mt-3 py-3 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="w-full md:w-auto">
          <h1
            onClick={() => navigate("/")}
            className="text-xl cursor-pointer font-bold text-gray-800"
          >
           To add (Header)
          </h1>
          {userData && (
            <p className="text-sm text-gray-600 mt-1 md:mt-0">
              Logged in as <span className="font-semibold">{username}</span>{" "}
              (<span className="text-blue-600">{email}</span>)
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-start md:justify-end w-full md:w-auto">
          {!userData && (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-700 cursor-pointer text-white px-4 py-1.5 rounded-lg hover:bg-green-800 text-sm font-medium w-full sm:w-auto"
            >
              Login
            </button>
          )}

          {userData && (
            <>
              <button
                onClick={handleHistoryButton}
                className={`${isOnHistoryPage ? `bg-amber-900` : `bg-purple-500`}  cursor-pointer text-white px-4 py-1.5 rounded-lg hover:text-black hover:bg-rose-100 text-sm font-medium w-full sm:w-auto`}
              >
                {isOnHistoryPage ? "🏠 Home" : "History ⏱"}
              </button>

              <button
                onClick={() => setToggleEditProfile(!toggleEditProfile)}
                className="bg-yellow-500 cursor-pointer text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 text-sm font-medium w-full sm:w-auto"
              >
                {toggleEditProfile ? "Cancel" : "Edit Profile"}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 text-white px-4 cursor-pointer py-1.5 rounded-lg hover:bg-red-600 text-sm font-medium w-full sm:w-auto"
              >
                Delete Account
              </button>

              <button
                onClick={handleLogout}
                className="bg-gray-700 cursor-pointer text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 text-sm font-medium w-full sm:w-auto"
              >
                Logout
              </button>
            </>
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