import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance.js";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post("/auth/forget-password", email, {
        headers: { "Content-Type": "text/plain" },
      });

      // Redirect to login with success message
      navigate("/login", {
        state: { message: "Password reset link sent to your email!" },
      });
    } catch (error) {
      const backendError =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-lg shadow-xl rounded-lg p-10">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-1">
          Forgot Password 🔑
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Enter your email address to reset your password
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base text-gray-800 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Enter your registered email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:opacity-70"
          >
            {loading ? "Sending..." : "Request Reset Link"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-700 mt-6">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Go back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
