import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUserCredentials } from "../store/features/backendSlice";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.backend.error);
  const status = useSelector((state) => state.backend.status);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [updateUser, setUpdateUser] = useState({
    updatedEmail: "",
    userGivenPassword: "",
    updatedPassword: "",
    updatedUsername: ""
  });

  const handleChange = (field) => (e) => {
    setUpdateUser((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { userGivenPassword, updatedPassword, updatedEmail } = updateUser;
    if (!userGivenPassword || !updatedPassword) {
      return toast.error("Original and new password are required!");
    }

    if (updatedEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updatedEmail)) {
        return toast.error("Please enter a valid email address!");
      }
    }

    dispatch(editUserCredentials(updateUser))
      .unwrap()
      .then(() => {
        toast.success("User updated successfully!");
        setUpdateUser({
          updatedEmail: "",
          userGivenPassword: "",
          updatedPassword: "",
          updatedUsername: ""
        });
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to update user");
        console.error("Error updating user:", err);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Your Credentials</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Email (optional)</label>
          <input
            type="email"
            placeholder="e.g. you@example.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={updateUser.updatedEmail}
            onChange={handleChange("updatedEmail")}
          />
        </div>

        {/* Current Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Enter your current password"
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            value={updateUser.userGivenPassword}
            onChange={handleChange("userGivenPassword")}
            required
          />
          <div
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
          >
            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={updateUser.updatedPassword}
            onChange={handleChange("updatedPassword")}
            required
          />
          <div
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Username (optional)</label>
          <input
            type="text"
            placeholder="e.g. vinit_rajwani"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={updateUser.updatedUsername}
            onChange={handleChange("updatedUsername")}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg cursor-pointer font-semibold hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;