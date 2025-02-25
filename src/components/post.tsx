import React from "react";
import {
  getCommentByPostId,
  getUserByid,
  User,
  type Post,
  Comment,
  createComment,
  addLike,
  deletePost,
  updateComment,
  deleteComment,
} from "../utils/service";
import { FaThumbsUp, FaRegThumbsUp, FaComment, FaUser, FaPaperPlane,FaTrash, FaEdit } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "./loading";
import { Link } from "react-router-dom";
import { EditPostModal } from "./editPost";

export default function PostPage(post: Post) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = React.useState("");
  const [showComments, setShowComments] = React.useState<{
    [postId: string]: boolean;
  }>({});
  const [newComment, setNewComment] = React.useState("");
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: () => {
      const saved = localStorage.getItem("user-session");
      if (!saved) return null;
      return JSON.parse(saved);
    },
  });
  const canDelete = session?.isAdmin || session?._id === post.userId;

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user", post.userId],
    queryFn: () => getUserByid(post.userId),
  });

  const { data: comments, isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ["comments", post._id],
    queryFn: () => getCommentByPostId(post._id),
  });
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(post._id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setNewComment("");
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: string) => addLike(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setEditingCommentId(null);
      setEditCommentContent("");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn:deletePost,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
});

  const handleCommentLike = (commentId: string) => {
    likeCommentMutation.mutate(commentId);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      createCommentMutation.mutate(newComment);
    }
  };

  const handleUpdateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCommentId && editCommentContent.trim()) {
      updateCommentMutation.mutate({
        commentId: editingCommentId,
        content: editCommentContent,
      });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const startEditingComment = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditCommentContent(comment.content);
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(post._id);
  }
};

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (isLoading || commentsLoading) return <Loading />;
  return (
    <div>
      <div
        key={post.slug}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        {/* Post Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2" >
            {user?.profilePicture ? (
              <img
                src={`${import.meta.env.VITE_BASE_URL}/${user.profilePicture}`}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <FaUser className="text-gray-500" />
                 )
            }
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {user?.username || "Unknown User"}
              </span>
              <span className="text-sm text-gray-500">• {post.category}</span>
            </div>
          </div>
          <div className="flex flex-row gap-7">
          {canDelete ? <FaTrash className="text-red-500" onClick={handleDeletePost} /> : null}
          {canDelete ? <FaEdit className="text-red-500" onClick={() => setIsEditing(true)} /> : null}
          </div>
        
        </div>

        {/* Post Title */}
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>

        {/* Post Content */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-wrap">{post.content}</p>

        {/* Post Image */}
        {post.image && (
          <img
            src={`${import.meta.env.VITE_BASE_URL}/${post.image}`}
            alt={post.title}
            className="w-full h-64 object-contain rounded-lg mb-4"
          />
        )}

        {/* Post Actions */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4">
            <Link
              to={`/post/${post.slug}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Read More
            </Link>
            <button
              onClick={() => toggleComments(post._id)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <FaComment />
              <span>{comments?.length} Comments</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-4 border-t pt-4">
          <button
            onClick={() => toggleComments(post._id)}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <FaComment />
            {comments?.length || 0} Comments
          </button>

          {showComments[post._id] && (
            <div className="mt-4 space-y-4">
              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="flex gap-2 max-sm:flex-col">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-2 py-2 w-24 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaPaperPlane />
                  Send
                </button>
              </form>

              {/* Comments List */}
              {comments?.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 mb-2">
                      {comment.userId.profilePicture ? (
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}/${comment.userId.profilePicture}`}
                          alt={comment.userId.username}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <FaUser className="text-gray-500 w-8 h-8" />
                      )}
                      <span className="font-medium">{comment.userId.username}</span>
                    </div>
                    {session?._id === comment.userId._id && (
                      <div className="flex gap-2">
                        <FaEdit
                          className="text-blue-500 cursor-pointer"
                          onClick={() => startEditingComment(comment)}
                        />
                        <FaTrash
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDeleteComment(comment._id)}
                        />
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment._id ? (
                    <form onSubmit={handleUpdateComment} className="mt-2 flex  flex-wrap gap-2">
                      <input
                        type="text"
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-2 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditCommentContent("");
                        }}
                        className="bg-gray-500 text-white px-2 py-2 rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                  )}
                  <button
                    onClick={() => handleCommentLike(comment._id)}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2"
                  >
                    {comment.likes?.includes(session?._id ?? "") ? (
                      <FaThumbsUp />
                    ) : (
                      <FaRegThumbsUp />
                    )}
                    {comment.numberOfLikes || 0} Likes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Modal - Moved outside of comments section */}
      {isEditing && (
        <EditPostModal
          post={post}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
