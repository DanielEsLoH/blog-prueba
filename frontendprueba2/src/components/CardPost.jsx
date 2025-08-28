import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CardPost = ({ post }) => {
  // Función simple para calcular tiempo relativo
  const timeAgo = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - postDate) / 1000); // diferencia en segundos

    if (diff < 60) return `${diff} seg${diff === 1 ? "" : "s"} atrás`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) === 1 ? "" : "s"} atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h${Math.floor(diff / 3600) === 1 ? "" : "s"} atrás`;
    return `${Math.floor(diff / 86400)} día${Math.floor(diff / 86400) === 1 ? "" : "s"} atrás`;
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 text-left">
      <h2 className="font-semibold text-xl mb-2">{post.title}</h2>
      <p className="text-gray-500 mb-2">
        Publicado por <span className="font-medium">{post.user.name}</span> • {timeAgo(post.created_at)}
      </p>
      <p className="text-gray-700 mb-4">
        {post.body.length > 100 ? `${post.body.slice(0, 100)}...` : post.body}
      </p>
      <Link
        to={`/posts/${post.id}`}
        className="inline-flex items-center text-indigo-500 hover:text-indigo-600 font-medium"
      >
        Leer más
        <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    </div>
  );
};

export default CardPost;
