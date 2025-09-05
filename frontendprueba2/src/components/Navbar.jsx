import { useState } from "react";
import { Link } from "react-router-dom";
import { navLinks, images } from "../utils/data";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleClick = (link) => {
    if (link.name === "Login") {
      setModalState("login");
      setShowModal(true);
      setMobileMenuOpen(false);
    } else if (link.name === "Register") {
      setModalState("register");
      setShowModal(true);
      setMobileMenuOpen(false);
    } else {
      window.location.href = link.path;
      setMobileMenuOpen(false);
    }
  };

  const logo = images.find(img => img.id === 1);

  return (
    <>
      <nav className="bg-indigo-50 shadow-md px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.src} alt={logo.alt} className="h-8 w-auto object-contain" />
          <span className="text-xl font-bold text-indigo-800 hover:text-indigo-900 transition-all">
            PosTeando
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            navLinks.map(link => (
              <button
                key={link.name}
                onClick={() => handleClick(link)}
                className={link.className}
              >
                {link.name}
              </button>
            ))
          ) : (
            <>
              <span className="text-gray-700">Hellow, {user.name}</span>
              <Link
                to="/myposts"
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-all"
              >
                My Posts
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-400 transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>

         {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-indigo-800 hover:text-indigo-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu (sidebar overlay) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-bold text-indigo-800">Menú</span>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">
          {!user ? (
            navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleClick(link)}
                className="text-left px-4 py-2 rounded-md hover:bg-indigo-100 text-indigo-800 font-medium"
              >
                {link.name}
              </button>
            ))
          ) : (
            <>
              <span className="px-4 text-gray-700 font-medium">
                👋 Hola, {user.name}
              </span>
              <Link
                to="/myposts"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-center"
              >
                My Posts
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-400 transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Auth modal */}
      <AuthModal
        show={showModal}
        onClose={() => setShowModal(false)}
        initialState={modalState}
      />
    </>
  );
};

export default Navbar;
