import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CardPost from "../components/CardPost";
import PostModal from "../components/PostModal";

const API_URL = import.meta.env.VITE_API_URL;

const MyPosts = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingPost, setEditingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const updated = {
        title: editingPost.title,
        body: editingPost.body,
      };

      const res = await axios.put(
        `${API_URL}/posts/${editingPost.id}`,
        { post: updated },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) =>
        prev.map((p) => (p.id === editingPost.id ? res.data : p))
      );

      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading your posts...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Posts</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">You have no posts yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <CardPost
              key={post.id}
              post={post}
              onEdit={setEditingPost}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editingPost && (
        <PostModal
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          title="Edit Post"
          newPost={editingPost}
          onChange={(e) =>
            setEditingPost({ ...editingPost, [e.target.name]: e.target.value })
          }
          onSubmit={handleEditSubmit}
          submitting={submitting}
          type="drawer"
        />
      )}
    </div>
  );
};

export default MyPosts;
