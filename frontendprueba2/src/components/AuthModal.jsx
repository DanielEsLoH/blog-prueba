import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // 👈 usamos el contexto

const AuthModal = ({ show, onClose, initialState = "login" }) => {
  const [state, setState] = useState(initialState);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { login, register } = useAuth();

  useEffect(() => {
    setState(initialState);
    resetForm();
  }, [initialState, show]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
  };

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === "register") {
        if (password !== passwordConfirmation) {
          alert("Passwords do not match");
          return;
        }

        await register(name, email, password, passwordConfirmation);
        await login(email, password);
      } else {
        await login(email, password);
      }

      onClose();
    } catch (err) {
      alert(err.message || "Error en autenticación");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-80 sm:w-[352px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-gray-500"
        >
          <p className="text-2xl font-medium m-auto">
            <span className="text-indigo-500">User</span>{" "}
            {state === "login" ? "Login" : "Sign Up"}
          </p>

          {state === "register" && (
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="text"
                required
              />
            </div>
          )}

          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="email"
              required
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="password"
              required
            />
          </div>

          {state === "register" && (
            <div className="w-full">
              <p>Confirm Password</p>
              <input
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                value={passwordConfirmation}
                placeholder="re-type password"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="password"
                required
              />
            </div>
          )}

          {state === "register" ? (
            <p className="text-sm">
              Already have account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-indigo-500 cursor-pointer"
              >
                click here
              </span>
            </p>
          ) : (
            <p className="text-sm">
              Create an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-indigo-500 cursor-pointer"
              >
                click here
              </span>
            </p>
          )}

          <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
            {state === "register" ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
