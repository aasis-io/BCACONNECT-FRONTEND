import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/AxiosInstance";
import Logo from "./../assets/logo.svg";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      axiosInstance
        .get("/user/me", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [jwt]);

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <Link to="/dashboard" className="hover:cursor-pointer"><img src={Logo} alt="" /></Link>
      </div>

      {/* Center: Tagline */}
      <div className="text-center hidden md:block">
        <h1 className="text-sm font-semibold text-gray-800">
          Swap Notes. Share Ideas. Stay Connected.
        </h1>
        <p className="text-xs text-gray-500">
          A simple way to swap notes, discover ideas, and stay in touch with
          your BCA community.
        </p>
      </div>

      {/* Right: Avatar + Name & Semester */}
      {jwt && user ? (
        <div className="flex items-center gap-2">
          <Link to="/dashboard/profile">
            <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
              <FaUserCircle className="text-white text-xl" />
            </div>
          </Link>
          <div className="text-left text-sm">
            <p className="font-medium text-gray-800">
              {user?.data?.fullName || ""}
            </p>
            <p className="text-gray-500 text-xs">
              {user?.data?.semester
                ? `${user.data.semester
                    .charAt(0)
                    .toUpperCase()}${user.data.semester.slice(1)} Sem`
                : ""}
            </p>
          </div>
        </div>
      ) : (
        <Link
          to="/login"
          className="flex items-center gap-1 hover:text-blue-700"
        >
          <FaUserCircle className="h-6 w-6" />
          Login
        </Link>
      )}
    </header>
  );
};

export default Header;
