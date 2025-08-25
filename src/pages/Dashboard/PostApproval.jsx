import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../api/AxiosInstance";
import PostCard from "../../components/PostCard";

const PostApproval = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visiblePost, setVisiblePost] = useState(null);
  const [userRole] = useState("MOD");
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    fetchPostsForApproval();
  }, []);

  const fetchPostsForApproval = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/moderator/unverifiedPosts", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setPosts(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      toast.error("Error loading posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (postId, verified) => {
    console.log("Sending to backend:", { id: postId, verified });
    try {
      await axiosInstance.post(
        `/moderator/verifyPost`,
        { id: postId, verified },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      toast.success(`Post ${verified ? "approved" : "rejected"} successfully`);
      fetchPostsForApproval();
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update post status");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Posts for Approval</h2>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No pending posts found.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">SN</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Author</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{post.caption}</td>
                <td className="p-2 border">
                  {post.userResponse?.fullName || "Unknown"}
                </td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      post.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : post.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.status || "PENDING"}
                  </span>
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => setVisiblePost(post)}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleStatusChange(post.id, 1)}
                    className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(post.id, 0)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Custom Dialog */}
      {visiblePost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2">
              <h3 className="text-lg font-semibold">Post Preview</h3>
              <button
                onClick={() => setVisiblePost(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <PostCard post={visiblePost} userRole={userRole} />
            </div>

            {/* Footer */}
            <div className="flex justify-end px-4 py-2 gap-2">
              <button
                onClick={() => {
                  handleStatusChange(visiblePost.id, 1);
                  setVisiblePost(null);
                }}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleStatusChange(visiblePost.id, 0);
                  setVisiblePost(null);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Reject
              </button>
              <button
                onClick={() => setVisiblePost(null)}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostApproval;
