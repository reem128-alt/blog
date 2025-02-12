import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createPost } from '../utils/service';

interface CreatePostProps {
    onClose: () => void;
}

const CreatePost = ({ onClose }: CreatePostProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [category, setCategory] = useState('');

    const mutation=useMutation({
        mutationFn:createPost,
        onSuccess:(data)=>{
            console.log(data)
            // Clear form after successful submission
            setTitle('');
            setContent('');
            setImage(null);
            setCategory('');
            toast.success('Post created successfully!');
            onClose(); // Close the modal after successful creation
        },
        onError:()=>{
           toast.error("failed create post")
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        // Ensure field names match exactly what backend expects
        formData.append('title', title.trim());
        formData.append('content', content.trim());
        formData.append('category', category.trim());
        if (image) {
            formData.append('image', image, image.name);
        }
        
        // Debug FormData contents
        console.log('Form values before submission:', {
            title: title.trim(),
            content: content.trim(),
            category: category.trim(),
            image: image ? image.name : null
        });
        
        mutation.mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className=" p-6 rounded-lg  space-y-4">
            <div>
                <label className="block text-md font-medium text-gray-900">Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
                <label className="block text-md font-medium text-gray-900">Content:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={4}></textarea>
            </div>
            <div>
                <label className="block text-md font-medium text-gray-900">Image:</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                            setImage(files[0]);
                        }
                    }} 
                    required 
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                />
            </div>
            <div>
                <label className="block text-md font-medium text-gray-900">Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    <option value="">Select a category</option>
                    <option value="tech">Tech</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="education">Education</option>
                </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Create Post</button>
        </form>
    );
};

export default CreatePost;
