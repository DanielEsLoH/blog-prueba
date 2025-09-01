import { Link } from "react-router-dom";
import { ArrowRight, Pencil, Trash } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CardPost = ({ post, onEdit, onDelete }) => {
  const { user: currentUser } = useAuth();

  const timeAgo = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - postDate) / 1000);

    if (diff < 60) return `${diff} seg${diff === 1 ? "" : "s"} atrás`;
    if (diff < 3600)
      return `${Math.floor(diff / 60)} min${
        Math.floor(diff / 60) === 1 ? "" : "s"
      } atrás`;
    if (diff < 86400)
      return `${Math.floor(diff / 3600)} h${
        Math.floor(diff / 3600) === 1 ? "" : "s"
      } atrás`;
    return `${Math.floor(diff / 86400)} día${
      Math.floor(diff / 86400) === 1 ? "" : "s"
    } atrás`;
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 text-left">
      <h2 className="font-semibold text-xl mb-2">{post.title}</h2>
      <p className="text-gray-500 mb-2">
        Posted by <span className="font-medium">{post.user.name}</span> •{" "}
        {timeAgo(post.created_at)}
      </p>
      <p className="text-gray-700 mb-4">
        {post.body.length > 100 ? `${post.body.slice(0, 100)}...` : post.body}
      </p>
      <Link
        to={`/posts/${post.id}`}
        className="inline-flex items-center text-indigo-500 hover:text-indigo-600 font-medium"
      >
        Read more
        <ArrowRight className="ml-2 w-4 h-4" />
      </Link>

      {/* Solo botones si el usuario actual es el dueño */}
      {currentUser?.id === post.user.id && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit && onEdit(post)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(post.id)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
          >
            <Trash className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CardPost;
