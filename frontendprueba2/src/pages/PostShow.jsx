import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import consumer from "../cable";

const API_URL = import.meta.env.VITE_API_URL;

const PostShow = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

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

  useEffect(() => {
    if (!id) return;

    const subscription = consumer.subscriptions.create(
      { channel: "PostsChannel" },
      {
        received(data) {
          console.log("Received data:", data);
          if (data.post && data.post.id.toString() === id) {
            setPost(data.post);
          }
        },
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!token) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${API_URL}/posts/${id}/comments`,
        { comment: { body: newComment } },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-500 transition"
        >
          ← Back
        </button>
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

      {/* Post Content*/}
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 md:p-10 mb-10">
        <article className="prose prose-lg max-w-none">
          <p className="leading-relaxed text-gray-800 whitespace-pre-line">
            {post.body}
          </p>
        </article>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border rounded-md mb-3 focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Write a comment..."
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-500">
            You must be logged in to comment.
          </p>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-white rounded-md shadow">
              <p className="font-semibold">{comment.user.name}</p>
              <p className="text-gray-600">{comment.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostShow;
