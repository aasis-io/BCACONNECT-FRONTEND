import React, { useEffect, useState } from "react";
import axiosInstance from "../api/AxiosInstance";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    axiosInstance
      .get("/post/getAllPosts")
      .then((res) => setPosts(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchUser = () => {
    axiosInstance
      .get("/user/me", { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => setUserRole(res.data.data.roles?.[0]))
      .catch((err) => console.error(err));
  };

  // Delete post
  const handleDelete = async (postId) => {
    try {
      await axiosInstance.delete(`/post/delete/${postId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Failed to delete post", err);
      throw err;
    }
  };

  // Save / Unsave post: update the local state to reflect saved posts
  const handleSaveToggle = async (postId, isCurrentlySaved) => {
    try {
      if (isCurrentlySaved) {
        await axiosInstance.post(`/post/unsavePost/${postId}`, null, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
      } else {
        await axiosInstance.post(`/post/savePost/${postId}`, null, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
      }
      // Update local post state to reflect saved/unsaved
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, saved: !isCurrentlySaved } : p
        )
      );
    } catch (err) {
      console.error("Save/Unsave error:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Feed</h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts available.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userRole={userRole}
              onDelete={handleDelete}
              onSaveToggle={handleSaveToggle} // 🔹 Pass save toggle callback
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
