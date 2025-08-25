import {
  BookmarkCheck,
  CircleUser,
  FileClock,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  Users
} from "lucide-react";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css"; // ✅ Optional for styling
import axiosInstance from "../api/AxiosInstance"; // adjust path as needed

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      axiosInstance
        .get("/user/me", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((res) => {
          setUser(res.data.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user info:", err);
        });
    }
  }, [jwt]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("jwt");
        Swal.fire("Logged out!", "You have been logged out successfully.", "success").then(() => {
          navigate("/login");
        });
      }
    });
  };

  const baseNavItems = [
    { label: "Home", to: "/dashboard", icon: <LayoutDashboard /> },
    { label: "Notes", to: "/dashboard/notes", icon: <NotebookPen /> },
    { label: "Add Post", to: "/dashboard/uploads", icon: <FilePlus2 /> },
    { label: "Saved Notes", to: "/dashboard/saved-notes", icon: <BookmarkCheck /> },
    { label: "Profile", to: "/dashboard/profile", icon: <CircleUser /> },
  ];

  const adminModNavItems = [
    { label: "Users", to: "/dashboard/users", icon: <Users /> },
    { label: "Posts for Approval", to: "/dashboard/approvals", icon: <FileClock /> },
  ];

  const navItems = [...baseNavItems];

  if (user?.roles?.includes("ADMIN") || user?.roles?.includes("MOD")) {
    navItems.push(...adminModNavItems);
  }

  return (
    <aside className="h-full w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Scrollable Nav */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <nav className="space-y-4">
          {navItems.map(({ label, to, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition ${
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-700"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Fixed Logout Button */}
      {jwt && (
        <div className="px-4 py-4 border-t border-gray-200">
          <Button
            label="Logout"
            icon={<LogOut size={18} />}
            onClick={handleLogout}
            style={{ color: "#f44336", textAlign: "left" }}
            className="w-full justify-start text-left gap-2 p-button-text text-red-600 hover:bg-red-50"
          />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
