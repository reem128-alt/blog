import axios from "axios";

const url = "https://blog-backend-1-97ay.onrender.com";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Create axios instance with default config
const api = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export type Post = {
  _id: string;
  category: string;
  content: string;
  image?: string;
  slug: string;
  title: string;
  userId: string;
};

export type User = {
  username: string;
  email: string;
  profilePicture: string;
};
export type Comment = {
  _id: string;
  content: string;
  userId: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  postId: string;
  likes: [User];
  numberOfLikes: number;
};
type Login = {
  password: string;
  email: string;
};
type UserInfo = {
  username: string;
  password: string;
  email: string;
};

export const signin = async (data: Login) => {
  try {
    const res = await api.post('/auth/signin', data);
    return res.data;
  } catch (err) {
    console.error('Signin error:', err);
    throw err;
  }
};

export const signout = async () => {
  try {
    const res = await api.post('/auth/signout');
    return res.data;
  } catch (err) {
    console.error('Signout error:', err);
    throw err;
  }
};

export const signup = async (data: UserInfo) => {
  const res = await api.post('/auth/signup', data);
  return res.data;
};

export const getAllpost = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/posts');
    // Ensure we're returning the array of posts from the response
    return Array.isArray(response.data)
      ? response.data
      : response.data.posts || [];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createPost = async (formData: FormData) => {
  try {
    console.log("Sending FormData to server...");
    // Log the FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log("FormData field:", pair[0], pair[1]);
    }

    const res = await api.post('/posts', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Add this to see the upload progress
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
        );
        console.log("Upload progress:", percentCompleted, "%");
      },
    });

    console.log("Server response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error creating post:", err);
    if (axios.isAxiosError(err)) {
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
    }
    throw err;
  }
};

export const deletePost = async (id: string) => {
  try {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAllUsers = async () => {
  const users = await api.get('/users/');
  return users.data;
};

export const getAllComment = async () => {
  const comments = await api.get('/comments/');
  return comments.data.comments;
};
export const getUserByid = async (id: string) => {
  const user = await api.get(`/users/${id}`);
  return user.data;
};
export const getCommentByPostId = async (postId: string) => {
  const comment = await api.get(`/comments/${postId}`);
  return comment.data;
};

export const createComment = async (postId: string, content: string) => {
  const comment = await api.post('/comments', { content, postId });
  return comment.data;
};

export const addLike = async (commentId: string) => {
  const res = await api.put(`/comments/like/${commentId}`);
  return res.data;
};
export const logout = async () => {
  const res = await api.post('/auth');
  return res.data;
};

export const updatePost = async (postId: string, formData: FormData) => {
  try {
    const res = await api.put(`/posts/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error updating post:", err);
    throw err;
  }
};

export const updateProfilePicture = async (formData: FormData) => {
  try {
    const res = await api.put('/users/profile-picture', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const updateUser = async (
  userId: string,
  data: { username: string; email: string }
) => {
  try {
    console.log("Updating user with ID:", userId);
    console.log("Update data:", data);
    const res = await api.put(`/users/update/${userId}`, data);
    // Transform the response to match the expected format
    return {
      user: res.data.updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
export const updateComment = async (
  commentId: string,
  data: { content: string }
) => {
  const res = await api.put(`/comments/${commentId}`, data);
  return await res.data;
};
export const deleteComment = async (commentId: string) => {
  const res = await api.delete(`/comments/${commentId}`);
  return await res.data;
};
