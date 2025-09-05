import React from "react";
import { PenSquare, Users, ThumbsUp } from "lucide-react";

const LandingPage = ({ onOpenAuthModal }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-r from-indigo-100 to-indigo-300 text-gray-900 px-6 py-20">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Share your ideas with the world 🌍
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Join our community of writers and readers. Post, comment, and connect with people who share your interests.
          </p>

          {/* Attention-grabbing signup banner */}
          <div className="inline-block bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-lg text-lg font-semibold animate-pulse">
            Sign up today and start sharing your ideas!
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-12 text-indigo-900">
            Why join?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition-all">
              <PenSquare className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-indigo-800">
                Easy Posting
              </h3>
              <p className="text-gray-600">
                Create posts in minutes with our simple and intuitive interface.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition-all">
              <Users className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-indigo-800">
                Connect with Others
              </h3>
              <p className="text-gray-600">
                Discover people with similar interests and build a community.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition-all">
              <ThumbsUp className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-indigo-800">
                Instant Feedback
              </h3>
              <p className="text-gray-600">
                Receive comments and likes on your posts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-indigo-200 text-indigo-900 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to get started?</h2>
        <button
          onClick={() => onOpenAuthModal("register")}
          className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md shadow hover:bg-indigo-100 transition-all"
        >
          Join Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-indigo-50 text-indigo-700 text-center">
        © {new Date().getFullYear()} MyPosts. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
