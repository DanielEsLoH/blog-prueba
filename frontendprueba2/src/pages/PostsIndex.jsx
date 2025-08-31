import { useEffect, useState } from "react";
import axios from "axios";
import * as ActionCable from "@rails/actioncable";
import CardPost from "../components/CardPost";
import PostForm from "../components/PostForm";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const PostsIndex = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 1️⃣ Fetch inicial
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

    // 2️⃣ Conectar a ActionCable
    const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    const subscription = cable.subscriptions.create(
      { channel: "PostsChannel" },
      {
        connected: () => console.log("✅ Conectado al canal PostsChannel"),
        disconnected: () => console.log("❌ Desconectado del canal PostsChannel"),
        received: (data) => {
          console.log("📩 WS recibido:", data);
          if (data.post) {
            setPosts((prev) => {
              if (prev.some((p) => p.id === data.post.id)) return prev;
              const updated = [...prev, data.post];
              // 🔽 Ordenar por fecha de creación DESC
              return updated.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              );
            });
          }
          if (data.deleted_id) {
            setPosts((prev) => prev.filter((p) => p.id !== data.deleted_id));
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
      cable.disconnect();
    };
  }, [token]);

  const handleChange = (e) =>
    setNewPost({ ...newPost, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.body || !user) return;

    try {
      setSubmitting(true);

      await axios.post(
        `${API_URL}/posts`,
        { post: { title: newPost.title, body: newPost.body } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewPost({ title: "", body: "" });
      setShowDrawer(false);
    } catch (err) {
      console.error("Error creando post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando posts...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Todos los Posts</h1>
        {user && (
          <button
            onClick={() => setShowDrawer(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-500 transition"
          >
            Nuevo Post
          </button>
        )}
      </div>

      {Array.isArray(posts) && posts.length === 0 ? (
        <p className="text-center text-gray-500">No hay posts aún.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(posts) &&
            posts.map((post) => <CardPost key={post.id} post={post} />)}
        </div>
      )}

      {user && (
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 z-50 ${
            showDrawer ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Crear Nuevo Post</h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <PostForm
              newPost={newPost}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsIndex;
