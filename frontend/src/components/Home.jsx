import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-blue-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background clouds & sun */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-yellow-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-white rounded-full blur-2xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-white rounded-full blur-2xl opacity-20 animate-float"></div>
      </div>

      {/* Title */}
      <div className="z-10 text-center space-y-6">
        <h1 className="text-[80px] sm:text-[100px] font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-tr from-pink-400 via-yellow-300 to-green-400 drop-shadow-lg animate-fade-in-up">
          <span className="inline-block transform hover:scale-110 transition">V</span>
          <span className="inline-block transform hover:scale-110 transition">B</span>
          <span className="inline-block transform hover:scale-110 transition">S</span>
        </h1>

        {/* Decorations */}
        <div className="text-4xl space-x-4 animate-fade-in">
          <span role="img" aria-label="cross">✝️</span>
          <span role="img" aria-label="Bible">📖</span>
          <span role="img" aria-label="dove">🕊️</span>
          <span role="img" aria-label="light">🌟</span>
        </div>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-semibold text-blue-900 animate-fade-in-up">Growing in God’s Love – Together!</p>

        {/* Login Button */}
        <Link to="/login">
          <button className="mt-6 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white text-xl rounded-full shadow-lg transform hover:scale-105 transition">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
