import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const semesters = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    semester: "First",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/register", formData);
      toast.success(response.data.message || "Registration successful");
      navigate("/login", {
         state: { message: "Check and verify your gmail !" },
      });
    } catch (error) {
      const backendError =
        error.response?.data?.error || error.response?.data?.message;
      toast.error(backendError || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4 py-12">
      <div className="w-full max-w-2xl bg-white/40 backdrop-blur-lg shadow-lg rounded-3xl p-10">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-1">
          Create an Account ✨
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Join the BCA Connect community
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-800 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-4 py-2 rounded bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition-all duration-150"
              placeholder="Your full name"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm text-gray-800 font-medium mb-1">
              Semester
            </label>
            <select
              value={formData.semester}
              onChange={(e) =>
                setFormData({ ...formData, semester: e.target.value })
              }
              className="w-full px-4 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
            >
              {semesters.map((sem, i) => (
                <option value={sem} key={i}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-800 font-medium mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition-all duration-150"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-800 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition-all duration-150"
                placeholder="••••••••"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </div>
            </div>
          </div>

          {/* Submit button with spinner */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 flex justify-center items-center bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-800 mt-6">
          Already Registered?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
