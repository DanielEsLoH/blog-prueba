import React from "react";
import { PenSquare, Users, ThumbsUp } from "lucide-react";

const LandingPage = ({ onOpenAuthModal }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-r from-indigo-100 to-indigo-300 text-gray-900 px-6 py-20">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Comparte tus ideas con el mundo 🌍
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Únete a nuestra comunidad de escritores y lectores. Publica, comenta
            y conecta con personas que comparten tus intereses.
          </p>

          {/* Banner de registro llamativo */}
          <div className="inline-block bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-lg text-lg font-semibold animate-pulse">
            ¡Regístrate hoy y empieza a publicar tus ideas!
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-12 text-indigo-900">
            ¿Por qué unirte?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition-all">
              <PenSquare className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-indigo-800">
                Publica fácilmente
              </h3>
              <p className="text-gray-600">
                Crea posts en minutos con nuestra interfaz simple e intuitiva.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition-all">
              <Users className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-indigo-800">
                Conecta con otros
              </h3>
              <p className="text-gray-600">
                Descubre personas con tus mismos intereses y crea comunidad.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition-all">
              <ThumbsUp className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-indigo-800">
                Feedback instantáneo
              </h3>
              <p className="text-gray-600">
                Recibe comentarios y likes en tus publicaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-indigo-200 text-indigo-900 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">¿Listo para empezar?</h2>
        <button
          onClick={() => onOpenAuthModal("register")}
          className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md shadow hover:bg-indigo-100 transition-all"
        >
          Únete ahora
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-indigo-50 text-indigo-700 text-center">
        © {new Date().getFullYear()} MyPosts. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default LandingPage;
