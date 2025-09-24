import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { createPost } from '../utils/service';
import { FaTimes, FaImage, FaHeading, FaTag, FaParagraph, FaPlus } from 'react-icons/fa';

interface CreatePostProps {
    onClose: () => void;
}

const CreatePost = ({ onClose }: CreatePostProps) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [category, setCategory] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setTitle('');
            setContent('');
            setImage(null);
            setCategory('');
            setPreviewImage(null);
            toast.success('Post created successfully!');
            onClose();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create post');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim() || !category) {
            toast.error('Please fill in all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('content', content.trim());
        formData.append('category', category.trim());
        
        if (image) {
            formData.append('image', image, image.name);
        } else if (!previewImage) {
            toast.error('Please select an image');
            return;
        }
        
        mutation.mutate(formData);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
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
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="bg-white rounded-xl w-full max-w-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Create New Post</h2>
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
                                    required
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
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 disabled:opacity-70"
                            >
                                {mutation.isPending ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : (
                                    <>
                                        <FaPlus />
                                        <span>Create Post</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
