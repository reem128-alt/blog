import {useQuery } from "@tanstack/react-query";
import { FaPlusCircle, FaUser } from "react-icons/fa";
import { getAllpost } from "./utils/service";
import type { Post } from "./utils/service";
import PostPage from "./components/post";
import { useState } from "react";
import CreatePost from "./components/createPost";
import Profile from "./components/profile";
import Loading from "./components/loading";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false); // Fetch all posts
  const { data: blogs = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getAllpost,
  });

  console.log(blogs);

  if (postsLoading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy">
      {/* Header Navigation */}
      <header className="bg-white bg-opacity-15 backdrop-blur-md shadow-lg border-b border-white/10">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <a
                href="/"
                className="text-white text-xl  font-serif font-bold tracking-wide hover:text-blue-200"
              >
                Social Blog
              </a>
              <button
                onClick={() => setShowModal(true)}
                className="text-white font-semibold hover:text-blue-200 flex items-center gap-2 transition-colors duration-200"
              >
                <FaPlusCircle className="text-blue-200" /> Create Post
              </button>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </nav>
         
        </div>
      </header>

      {/* Profile Sidebar */}
      <Profile isOpen={showProfile} onClose={() => setShowProfile(false)} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Posts List */}
          <div className="space-y-6">
            {Array.isArray(blogs) &&
              blogs.map((post: Post) => {
                return <PostPage {...post} key={post._id} />;
              })}
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
              <div className="bg-gradient-to-br from-white/10 to-white/20 p-6 rounded-xl shadow-xl backdrop-blur-md border border-white/20 w-full max-w-md">
                <button
                  onClick={() => setShowModal(false)}
                  className="mb-4 text-white hover:text-blue-200 transition-colors duration-200"
                >
                  Close
                </button>
                <CreatePost onClose={() => setShowModal(false)} />
                
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
