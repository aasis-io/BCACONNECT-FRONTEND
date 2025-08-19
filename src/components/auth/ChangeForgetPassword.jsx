// src/pages/ChangeForgetPassword.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";

export default function ChangeForgetPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    const changePassword = async () => {
      try {
        const response = await axiosInstance.get(
          `/auth/change-password?token=${token}`
        );
        setMessage(response.data);

        // Redirect to login after 4 seconds with success message
        setTimeout(() => {
          navigate("/login", {
            state: {
              message:
                "Password has been reset to BCACONNECT. Please login and change it.",
            },
          });
        }, 4000);
      } catch (err) {
        const serverMsg =
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message || "Something went wrong";
        setError(serverMsg);
      }
    };

    changePassword();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-lg shadow-xl rounded-lg p-10 text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          Password Reset 🔑
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          We’re processing your password reset request...
        </p>

        {message && (
          <div className="text-green-600 font-medium bg-green-100 rounded-lg p-3 shadow-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="text-red-600 font-medium bg-red-100 rounded-lg p-3 shadow-sm">
            {error}
          </div>
        )}
        {!message && !error && (
          <div className="text-gray-700 font-medium bg-gray-100 rounded-lg p-3 shadow-sm">
            Processing your request...
          </div>
        )}

        {(message || error) && (
          <p className="text-xs text-gray-500 mt-6">
            You’ll be redirected shortly...
          </p>
        )}
      </div>
    </div>
  );
}
