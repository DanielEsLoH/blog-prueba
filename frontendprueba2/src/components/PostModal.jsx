// src/components/PostModal.jsx
import PostForm from "./PostForm";

const PostModal = ({
  isOpen,
  onClose,
  newPost,
  onChange,
  onSubmit,
  submitting,
}) => {
  if (!isOpen) return null;

  const isEditing = !!newPost?.id;
  const title = isEditing ? "Edit Post" : "New Post";

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <PostForm
          newPost={newPost}
          onChange={onChange}
          onSubmit={onSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
};

export default PostModal;
