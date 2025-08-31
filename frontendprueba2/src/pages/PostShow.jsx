import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const PostShow = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-500 transition"
        >
          ← Back
        </Link>
      </div>

      {/* Author + Date */}
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
          {post.user?.name?.[0] || post.user?.email?.[0]}
        </div>
        <div>
          <p className="font-medium text-gray-700">
            {post.user?.name || post.user?.email}
          </p>
          <p>
            {new Date(post.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Card Content*/}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 md:p-10">
          <article className="prose prose-lg max-w-none">
            <p className="leading-relaxed text-gray-800 whitespace-pre-line">
              {post.body}
            </p>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PostShow;
