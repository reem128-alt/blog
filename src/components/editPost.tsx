import React from "react";
import { updatePost, type Post } from "../utils/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTimes, FaImage, FaHeading, FaTag, FaParagraph } from "react-icons/fa";

const url=import.meta.env.VITE_BASE_URL
export function EditPostModal({ post, isOpen, onClose }: { post: Post; isOpen: boolean; onClose: () => void }) {
  const [title, setTitle] = React.useState(post.title);
  const [content, setContent] = React.useState(post.content);
  const [category, setCategory] = React.useState(post.category);
  const [image, setImage] = React.useState<File | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(
    post.image ? `${url}/${post.image}` : null
  );
  const queryClient = useQueryClient();

  const updatePostMutation = useMutation({
    mutationFn: (formData: FormData) => updatePost(post._id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }
    updatePostMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90 rounded-xl shadow-2xl p-6 w-full max-w-xl border-2 border-white/30 my-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <div className="flex justify-between items-center mb-6 border-b-2 border-white/30 pb-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 p-2 rounded-lg">
                  <FaHeading className="text-white" size={20} />
                </span>
                Edit Post
              </h2>
              <button 
                onClick={onClose} 
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white text-base font-medium mb-1">
                  <FaHeading />
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg focus:outline-none focus:border-white/50 text-white placeholder-white/50 text-base"
                  required
                  placeholder="Enter post title..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white text-base font-medium mb-1">
                  <FaParagraph />
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg focus:outline-none focus:border-white/50 text-white placeholder-white/50 text-base"
                  rows={5}
                  required
                  placeholder="Write your post content..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white text-base font-medium mb-1">
                  <FaTag />
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 border-2 border-white/30 rounded-lg focus:outline-none focus:border-white/50 text-white placeholder-white/50 text-base"
                  required
                  placeholder="Enter post category..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-white text-base font-medium mb-1">
                  <FaImage />
                  Image
                </label>
                <img src={post.image} alt="Post Image" style={{ maxWidth: '100%', marginBottom: '1rem' }} />
                {previewImage ? (
                  <div className="relative w-full h-40 bg-white/20 rounded-lg overflow-hidden">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setImage(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-white/30 border-dashed rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 transition-all">
                    <div className="flex flex-col items-center justify-center py-4">
                      <FaImage className="text-white mb-2" size={24} />
                      <p className="text-white text-base">Click to upload image</p>
                    </div>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-white/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-base font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatePostMutation.isPending}
                  className="px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {updatePostMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Post"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
