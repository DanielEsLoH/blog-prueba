import { useState } from "react";
import { Link } from "react-router-dom";
import { navLinks, images } from "../utils/data";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // íconos para el menú

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
              <span className="text-gray-700">Hola, {user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-all"
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-50 px-6 py-4 flex flex-col gap-2 shadow-md">
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
              <span className="text-gray-700">Hola, {user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      <AuthModal
        show={showModal}
        onClose={() => setShowModal(false)}
        initialState={modalState}
      />
    </>
  );
};

export default Navbar;
