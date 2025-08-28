import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import PostsIndex from "./pages/PostsIndex";
import AuthModal from "./components/AuthModal";

const Home = () => <h1 className="p-4 text-xl">Bienvenido a la App 🚀</h1>;

function App() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalState, setModalState] = useState("login");

  const openAuthModal = (state) => {
    setModalState(state);
    setShowAuthModal(true);
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {!user && <Route path="/" element={<LandingPage />} />}
        {user && <Route path="/" element={<PostsIndex />} />}
      </Routes>
      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialState={modalState}
      />
    </BrowserRouter>
  );
}

export default App;
