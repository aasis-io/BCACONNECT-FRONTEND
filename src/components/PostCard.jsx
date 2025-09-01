import { Bookmark, Expand, Trash2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Lightbox from "yet-another-react-lightbox";
import axiosInstance from "../api/AxiosInstance";

const PostCard = ({
  post,
  userRole,
  currentUserId, // 👈 new prop
  onDelete,
  onUnsave,
  initialSaved = false,
}) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const handleToggleSave = async (postId) => {
    try {
      if (isSaved) {
        await axiosInstance.post(`/post/unsavePost/${postId}`);
        setIsSaved(false);
        toast.success("Post removed from saved notes");
        if (onUnsave) onUnsave(postId);
      } else {
        await axiosInstance.post(`/post/savePost/${postId}`);
        setIsSaved(true);
        toast.success("Post saved successfully");
      }
    } catch (error) {
      console.error("Save/Unsave error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(postId);
        Swal.fire("Deleted!", "The post has been deleted.", "success");
      }
    });
  };

  const isImage = post.fileType?.startsWith("image");
  const isPdf = post.fileType?.includes("pdf");

  return (
    <>
      {/* Card */}
      <div className="bg-white p-4 rounded-md shadow-sm hover:shadow transition">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {post.userResponse?.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {post.userResponse?.fullName}
              </p>
              <p className="text-xs text-gray-500">{formatDate(post.date)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Save / Unsave */}
            <button
              className={`${
                isSaved ? "text-green-600" : "text-blue-500"
              } hover:opacity-80`}
              onClick={() => handleToggleSave(post.id)}
              title={isSaved ? "Unsave Post" : "Save Post"}
            >
              <Bookmark fill={isSaved ? "currentColor" : "none"} />
            </button>

            {/* Delete - admin, moderator, OR own post */}
            {onDelete &&
              (userRole === "ADMIN" ||
                userRole === "MODERATOR" ||
                post.userResponse?.id === currentUserId) && (
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(post.id)}
                  title="Delete Post"
                >
                  <Trash2 />
                </button>
              )}
          </div>
        </div>

        <h3 className="text-base font-semibold text-blue-700 mb-1">
          {post.caption}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{post.content}</p>

        <div className="flex gap-4 mb-3">
          {post.semester && (
            <p className="text-xs text-gray-400">{post.semester} Sem</p>
          )}
          {post.subject && (
            <p className="text-xs text-gray-400">{post.subject}</p>
          )}
        </div>

        {/* File rendering */}
        {post.fileUrl && (
          <>
            {isImage ? (
              <div className="relative group w-full h-96 rounded-md overflow-hidden">
                <img
                  src={post.fileUrl}
                  alt={post.filename}
                  className="w-full h-full object-cover transition duration-300 group-hover:brightness-90"
                />
                <div className="absolute inset-0.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <button
                    className="bg-white/90 text-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-white hover:cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
                    <Expand size={18} /> View Fullscreen
                  </button>
                </div>
              </div>
            ) : isPdf ? (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {post.filename.split("_").slice(1).join("_")}
                </p>
                <a
                  href={post.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open File
                </a>
              </div>
            ) : null}
          </>
        )}
      </div>

      {isOpen && isImage && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={[{ src: post.fileUrl, alt: post.filename }]}
        />
      )}
    </>
  );
};

export default PostCard;
