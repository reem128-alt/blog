import React, { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  FaUser,
  FaEnvelope,
  FaTimes,
  FaSignOutAlt,
  FaEdit,
  FaCheck,
  FaTimes as FaCancel,
} from "react-icons/fa";
import { logout, updateProfilePicture, updateUser } from "../utils/service";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}
const url = import.meta.env.VITE_BASE_URL;
export default function Profile({ isOpen, onClose }: ProfileProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
  });

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: () => {
      const saved = localStorage.getItem("user-session");
      if (!saved) return null;
      return JSON.parse(saved);
    },
  });
  useEffect(() => {
    // Get timestamp from localStorage (if exists)
    const expirationTime = localStorage.getItem("session-expiration");
  
    if (expirationTime) {
      const timeLeft = parseInt(expirationTime) - Date.now();
      if (timeLeft > 0) {
        // If time is still remaining, set a new timeout
        setTimeout(() => {
          localStorage.clear();
          console.log("Local storage cleared after one hour");
        }, timeLeft);
      } else {
        // If expired, clear storage immediately
        localStorage.clear();
        console.log("Session expired, clearing local storage now.");
      }
    } else {
      // Set expiration time if it doesn't exist
      localStorage.setItem("session-expiration", (Date.now() + 3600000).toString());
      setTimeout(() => {
        localStorage.clear();
        console.log("Local storage cleared after one hour");
      }, 3600000); // 1 hour
    }
  }, []);
  

  const updateProfileMutation = useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      const currentSession = queryClient.getQueryData(["session"]);
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          profilePicture: data.user.profilePicture,
        };
        queryClient.setQueryData(["session"], updatedSession);
        localStorage.setItem("user-session", JSON.stringify(updatedSession));
      }
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: { username: string; email: string }) => {
      if (!session?._id) {
        throw new Error("No user session found");
      }
      return updateUser(session._id, data);
    },
    onSuccess: (data) => {
      // Invalidate and refetch session
      queryClient.invalidateQueries({ queryKey: ["session"] });
      const currentSession = queryClient.getQueryData(["session"]);
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          username: data.user.username,
          email: data.user.email,
        };
        queryClient.setQueryData(["session"], updatedSession);
        localStorage.setItem("user-session", JSON.stringify(updatedSession));
      }
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      console.log(file)
      console.log(formData)
      updateProfileMutation.mutate(formData);
    }
  };

  const handleEditStart = () => {
    setEditForm({
      username: session?.username || "",
      email: session?.email || "",
    });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(editForm);
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleSignOut = async () => {
    try {
      await logout();
      queryClient.setQueryData(["session"], null);
      localStorage.removeItem("user-session");
      onClose();
      navigate("/signin");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 
          ${isOpen ? "opacity-50" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 
          text-white shadow-2xl z-50 transform transition-all duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes
            size={24}
            className="transform hover:rotate-90 transition-transform duration-300"
          />
        </button>

        <div className="flex flex-col items-center p-8 space-y-6">
          {/* Profile Picture - Add entrance animation */}
          <div
            className="relative group transform transition-all duration-500 delay-100 
            ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}"
          >
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg 
              hover:scale-105 transition-transform duration-300 relative"
            >
              {session?.profilePicture ? (
                <img
                  src={session.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FaUser size={40} className="text-white opacity-75" />
                </div>
              )}
              {/* Edit overlay */}
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center 
                  opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleEditClick}
              >
                <FaEdit size={24} className="text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* User Info - Add staggered entrance animation */}
          <form onSubmit={handleEditSubmit}>
            <div className="w-full space-y-4">
              <div
                className={`bg-white bg-opacity-10 rounded-lg p-4 transform transition-all duration-500 delay-200
                ${
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-8 opacity-0"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaUser className="text-purple-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Username</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-white"
                      />
                    ) : (
                      <p className="font-medium">{session?.username}</p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`bg-white bg-opacity-10 rounded-lg p-4 transform transition-all duration-500 delay-300
                ${
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-8 opacity-0"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-purple-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full bg-white bg-opacity-10 rounded px-2 py-1 text-white"
                      />
                    ) : (
                      <p className="font-medium">{session?.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Controls */}
              <div className="mt-4 flex justify-end space-x-2">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={handleEditStart}
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg 
                      py-2 px-4 flex items-center space-x-2 text-sm transition-colors"
                  >
                    <FaEdit size={16} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleEditCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg 
                        py-2 px-4 flex items-center space-x-2 text-sm transition-colors"
                    >
                      <FaCancel size={16} />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white rounded-lg 
                        py-2 px-4 flex items-center space-x-2 text-sm transition-colors"
                    >
                      <FaCheck size={16} />
                      <span>Save</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className={`w-full mt-8 bg-red-500 hover:bg-red-600 text-white rounded-lg 
              py-3 px-4 flex items-center justify-center space-x-2 transform transition-all 
              duration-500 delay-400 hover:scale-105
              ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
          >
            <FaSignOutAlt className="text-white" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
