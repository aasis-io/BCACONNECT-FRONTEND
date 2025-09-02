import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance.js";
import GitHubLogo from "../../assets/github.svg";
import GoogleLogo from "../../assets/google.svg";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Show message from location state or query params
  useEffect(() => {
    // 1️⃣ State message (e.g., after registration)
    if (location.state?.message) {
      setMessage(location.state.message);
    }

    // 2️⃣ URL query param message (e.g., token expired)
    const params = new URLSearchParams(window.location.search);
    const messageFromURL = params.get("message");
    if (messageFromURL) {
      toast.error(decodeURIComponent(messageFromURL));
      // Optional: remove query param from URL after showing toast
      const url = new URL(window.location);
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.toString());
    }
  }, [location]);

  // OAuth token or message
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      toast.success("Login Successful");
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("jwt");

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("jwt", response.data.data);
      toast.success("Login Successful");
      navigate("/dashboard", { state: { email: formData.email } });
    } catch (error) {
      const status = error.response?.status;
      const backendError =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.error ||
            error.response?.data?.message ||
            "Unknown error";

      if (backendError === "Email not verified") {
        toast.error("Check and verify your Email First !")
        setMessage("Check and verify your Email !");
      } else if (status === 400 || status === 401) {
        toast.error(backendError || "Invalid email or password.");
      } else if (status === 404) {
        toast.error(backendError || "User not found.");
      } else if(backendError === "TokenExpired"){
             toast.error("Email Verification Link sent ! Check Email");
             setMessage("Check and verify your Email !");
      }
      else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleGoogleLogin = () => {
    const clientId =
      "721082640319-0ldnn9hvqmm57j1am401cq0pnn1idkq0.apps.googleusercontent.com"; 
    const redirectUri = "http://localhost:8080/auth/google/callback";
    const scope = "openid email profile";
    const responseType = "code";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    window.location.href = authUrl;
  };

  const handleGitHubLogin = () => {
    const clientId = "Ov23likCWv1m4x4PSDLb";
    const redirectUri = "http://localhost:8080/auth/github/callback";
    const scope = "user:email";

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-lg shadow-xl rounded-lg p-10">
        {message && (
          <div className="text-green-600 text-center mb-4">{message}</div>
        )}

        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-1">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Sign in to your BCA Connect account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base text-gray-800 font-medium mb-1">
              Email
            </label>
            <input
              type="text"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-base text-gray-800 font-medium mb-1">
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
                className="w-full px-4 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                placeholder="••••••••"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-700 mt-6">
          Not a member yet?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <p className="text-sm text-center text-gray-700 mt-2">
          Forgot password?{" "}
          <Link
            to="/forgot-password"
            className="text-blue-600 font-medium hover:underline"
          >
            Click here
          </Link>
        </p>

        <span className="block text-center my-6 text-gray-600 relative before:absolute before:w-[45%] before:h-[2px] before:bg-gray-300 before:left-0 before:top-[50%] after:absolute after:w-[45%] after:h-[2px] after:bg-gray-300 after:right-0 after:top-[50%] font-semibold">
          or
        </span>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full border border-gray-200 py-3 px-6 rounded-lg bg-gray-50 hover:bg-gray-200 duration-200"
          >
            <img src={GoogleLogo} alt="Google Logo" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <button
            onClick={handleGitHubLogin}
            className="flex items-center justify-center w-full border border-gray-200 py-3 px-6 rounded-lg bg-gray-50 hover:bg-gray-200 duration-200"
          >
            <img src={GitHubLogo} alt="GitHub Logo" className="w-5 h-5 mr-2" />
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
