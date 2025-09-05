import { useEffect, useState } from "react";
import axios from "axios";
import { getConsumer } from "../cable";
import CardPost from "../components/CardPost";
import PostModal from "../components/PostModal";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const PostsIndex = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer
  const [showDrawer, setShowDrawer] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 1️⃣ Init Fetch
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error al cargar posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    
    if (!user) return;
    const consumer = getConsumer();

    // 2️⃣ Connect to ActionCable
    const subscription = consumer.subscriptions.create(
      { channel: "PostsChannel" },
      {
        received: (data) => {
          if (data.post) {
            // update/create
            setPosts((prev) => {
              const updated = prev.some((p) => p.id === data.post.id)
                ? prev.map((p) => (p.id === data.post.id ? data.post : p))
                : [...prev, data.post];

              return updated.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              );
            });
          }

          if (data.deleted || data.post_id) {
            setPosts((prev) => prev.filter((p) => p.id !== data.post_id));
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleChange = (e) =>
    setNewPost({ ...newPost, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.body || !user) return;

    try {
      setSubmitting(true);

      if (newPost.id) {
        // 🔄 Edit
         const { data: updatedPost } = await axios.patch(
          `${API_URL}/posts/${newPost.id}`,
          { post: { title: newPost.title, body: newPost.body } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // 🆕 Create
        await axios.post(
          `${API_URL}/posts`,
          { post: { title: newPost.title, body: newPost.body } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // reset form
      setNewPost({ id: null, title: "", body: "" });
      setShowDrawer(false);
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setNewPost({ id: post.id, title: post.title, body: post.body });
    setShowDrawer(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">All Post</h1>
        {user && (
          <button
            onClick={() => setShowDrawer(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-500 transition"
          >
            New Post
          </button>
        )}
      </div>

      {Array.isArray(posts) && posts.length === 0 ? (
        <p className="text-center text-gray-500">Dont Post Yet</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <CardPost
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* unified drawer */}
      <PostModal
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        newPost={newPost}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
};

export default PostsIndex;
