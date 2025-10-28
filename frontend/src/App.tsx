export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="relative p-10 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center overflow-hidden">

        {/* Floating Gradient Orbs */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>

        {/* Content */}
        <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-text">
          Hello, World!
        </h1>
        <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
          Welcome to your colorful React + Tailwind universe 🌈
          Build, dream, and code in vibrant harmony.
        </p>

        <button className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full text-white font-semibold shadow-lg hover:shadow-pink-500/50 transition duration-300 transform hover:scale-105">
          Get Started 🚀
        </button>
      </div>
    </div>
  );
}
