import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-yellow-50 flex flex-col justify-center items-center px-6">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-indigo-800 mb-4">
          PayPact
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-xl mx-auto mb-8">
          Simplify your group expenses. Track, split, and settle with ease. Welcome to the future of smart spending.
        </p>

        <div className="flex gap-6 justify-center">
          <Link to="/login">
            <button className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg cursor-pointer hover:scale-[1.02] transition-all duration-300">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="px-6 py-3 rounded-full bg-white border-2 border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-100 shadow-md cursor-pointer hover:scale-[1.02] transition-all duration-300">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}