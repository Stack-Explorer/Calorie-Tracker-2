import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { sendUserData } from "../store/features/backendSlice";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👁️ imported here

const Signup = ({ switchToLogin }) => {

  const dispatch = useDispatch();
  const status = useSelector((state) => state.backend.status);
  const data = useSelector((state) => state.backend.data);
  const isAuthenticated = useSelector((state) => state.backend.isAuthenticated);
  const message = useSelector((state) => state.backend.message);

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  isAuthenticated && navigate("/");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    const resultAction = await dispatch(sendUserData(form));

    if (sendUserData.rejected.match(resultAction)) {
      toast.error(resultAction.payload?.message || "Signup failed");
    } else {
      toast.success("Account created!");
    }
  };


  return (
    <>
      <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-xl rounded-2xl border">
        <Toaster />
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl pr-10"
            />
            <span
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <p className="text-xs text-red-500 mt-1 ml-1">
            ⚠️ Remember your password! If forgotten, you won’t be able to log in again.
          </p>
          <button type="submit" className="w-full py-3 cursor-pointer bg-green-600 text-white font-semibold rounded-xl">
            Create Account
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </>
  );
};

export default Signup;