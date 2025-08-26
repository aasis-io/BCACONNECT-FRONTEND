import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/AxiosInstance";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const jwt = localStorage.getItem("jwt");

  // Redirect to login page if no JWT token
  useEffect(() => {
    if (!jwt) {
      window.location.href = "/login"; // Or use a react-router redirect
    }
  }, [jwt]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/moderator/getUsers", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Error loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const deleteUser = async (email) => {
    if (
      !window.confirm(`Are you sure you want to delete user "${email}"?`)
    ) {
      return;
    }

    try {
      await axiosInstance.delete(`/moderator/delete/${email}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      toast.success("Successfully deleted!");
      fetchAllUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user.");
    }
  };

  const promoteUser = async (email) => {
    try {
      await axiosInstance.post(`/admin/makeModerator/${email}`, null, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      toast.success("Successfully promoted!");
      fetchAllUsers();
    } catch (error) {
      console.error("Failed to promote user", error);
      toast.error("Failed to promote user.");
    }
  };

  const demoteUser = async (email) => {
    try {
      await axiosInstance.post(`/admin/removeModerator/${email}`, null, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      toast.success("Successfully demoted!");
      fetchAllUsers();
    } catch (error) {
      console.error("Failed to demote user", error);
      toast.error("Failed to demote user.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Users</h2>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">SN</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">email</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{user.fullName}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  {user.roles[user.roles.length - 1]}
                </td>
                <td className="p-2 border space-x-2">
                  {user.roles[user.roles.length - 1] !== "ADMIN" && (
                    <>
                      <button
                        onClick={() => deleteUser(user.email)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                      >
                        Delete
                      </button>

                      {user.roles[user.roles.length - 1] === "USER" ? (
                        <button
                          onClick={() => promoteUser(user.email)}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                        >
                          Promote
                        </button>
                      ) : (
                        <button
                          onClick={() => demoteUser(user.email)}
                          className="px-2 py-1 bg-cyan-500 text-white rounded text-xs"
                        >
                          Demote
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListUsers;