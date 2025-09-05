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

  const logo = images.find((img) => img.id === 1);

  return (
    <>
      <nav className="bg-indigo-50 shadow-md px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.src} alt={logo.alt} className="h-8 w-auto object-contain" />
          <span className="text-xl font-bold text-indigo-800 hover:text-indigo-900 transition-all">
            PostIng
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            navLinks.map((link) => (
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
              <span className="text-gray-700">Hello, {user.name}</span>

              {/* My Posts menos llamativo */}
              <Link
                to="/myposts"
                className="px-4 py-2 rounded-md bg-indigo-200 text-indigo-800 hover:bg-indigo-300 transition-colors"
              >
                My Posts
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md bg-red-200 text-red-800 hover:bg-red-300 transition-colors"
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

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile menu sidebar */}
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
                👋 Hello, {user.name}
              </span>

              {/* My Posts  */}
              <Link
                to="/myposts"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-md bg-indigo-200 text-indigo-800 hover:bg-indigo-300 transition-colors text-center"
              >
                My Posts
              </Link>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-md bg-red-200 text-red-800 hover:bg-red-300 transition-colors"
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
