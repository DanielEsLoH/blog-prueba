import PostImg from '/post1.png'

export const navLinks = [
  {
    name: "Login",
    path: "/login",
    authRequired: false,
    className:
      "px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50 transition"
  },
  {
    name: "Register",
    path: "/register",
    authRequired: false,
    className:
      "px-4 py-2 bg-indigo-500 text-white text-sm rounded-full hover:opacity-90 transition"
  }
]

export const images = [
  {
    id: 1,
    src: PostImg,
    alt: 'Post Image'
  }
]