import React, { useRef } from "react";
import { updatePost, type Post } from "../utils/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTimes, FaImage, FaHeading, FaTag, FaParagraph, FaSave, FaTrash } from "react-icons/fa";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { toast } from 'react-toastify';

const url = import.meta.env.VITE_BASE_URL;

export function EditPostModal({ post, isOpen, onClose, onDelete }: { 
  post: Post; 
  isOpen: boolean; 
  onClose: () => void;
  onDelete: (postId: string) => Promise<void>;
}) {
  const [title, setTitle] = React.useState(post.title);
  const [content, setContent] = React.useState(post.content);
  const [category, setCategory] = React.useState(post.category);
  const [image, setImage] = React.useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(
    post.image 
      ? post.image.startsWith('http') 
        ? post.image 
        : post.image.startsWith('/') 
          ? `${url}${post.image}`
          : `${url}/${post.image}`
      : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const updatePostMutation = useMutation({
    mutationFn: (formData: FormData) => updatePost(post._id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success('Post updated successfully!');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update post');
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewImage(null);
    // Keep the original image URL for reference
    setPreviewImage(
      post.image 
        ? post.image.startsWith('http') 
          ? post.image 
          : post.image.startsWith('/')
            ? `${url}${post.image}`
            : `${url}/${post.image}`
        : null
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    formData.append("category", category.trim());
    
    if (image) {
      formData.append("image", image);
    }
    
    updatePostMutation.mutate(formData);
  };

  if (!isOpen) return null;

  const handleDeleteClick = async () => {
    try {
      await onDelete(post._id);
      toast.success('Post deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="bg-white rounded-xl w-full max-w-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Post</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewImage ? (
                  <div className="relative">
                    <div className="w-full h-64 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    >
                      <FaTimes className="text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-purple-100 p-4 rounded-full mb-4">
                      <FaImage className="text-purple-600 text-2xl" />
                    </div>
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FaHeading className="mr-2 text-purple-600" />
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FaParagraph className="mr-2 text-purple-600" />
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FaTag className="mr-2 text-purple-600" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                <option value="tech">Technology</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="education">Education</option>
                <option value="business">Business</option>
                <option value="health">Health & Wellness</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <FaTrash className="mr-2" />
                Delete Post
              </button>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatePostMutation.isPending}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 disabled:opacity-70"
                >
                  {updatePostMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    <>
                      <FaSave />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          confirmText="Delete Post"
          onConfirm={handleDeleteClick}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
