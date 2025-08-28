const PostForm = ({ newPost, onChange, onSubmit, submitting }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 flex-1">
      <input
        type="text"
        name="title"
        value={newPost.title}
        onChange={onChange}
        placeholder="Título"
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        name="body"
        value={newPost.body}
        onChange={onChange}
        placeholder="Contenido"
        rows={6}
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
      ></textarea>
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-500 transition"
      >
        {submitting ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
};

export default PostForm;
