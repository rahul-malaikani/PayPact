import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHandHoldingUsd, FaExchangeAlt, FaUsers } from 'react-icons/fa';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#edf2ff] to-blue-300 flex flex-col items-center justify-center px-4 py-16 text-center">

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="akira text-[8vw] font-bold bg-gradient-to-r from-indigo-900 to-blue-500 bg-clip-text text-transparent w-full max-w-5xl hover:text-black transition-colors duration-300 ease-in-out cursor-pointer"
        style={{ lineHeight: '1.1' }}
      >
        PAYPACT
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-gray-500 text-md md:text-md max-w-xl mx-auto"
      >
        Simplify your group expenses. Track, split, and settle with ease.
      </motion.p>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="flex flex-wrap justify-center gap-6 mt-12"
      >
        {/* Split Expenses */}
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-64 hover:shadow-lg transition-transform hover:-translate-y-1 hover:scale-[1.02] duration-300 cursor-pointer">
          <FaUsers className="text-indigo-600 text-3xl mb-3 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Split Expenses</h3>
          <p className="text-sm text-gray-500">Effortlessly divide group bills and shared costs.</p>
        </div>

        {/* Track Debts */}
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-64 hover:shadow-lg transition-transform hover:-translate-y-1 hover:scale-[1.02] duration-300 cursor-pointer">
          <FaExchangeAlt className="text-indigo-600 text-3xl mb-3 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Track Debts</h3>
          <p className="text-sm text-gray-500">Keep tabs on who owes whom in real-time.</p>
        </div>

        {/* Smart Settlement */}
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-64 hover:shadow-lg transition-transform hover:-translate-y-1 hover:scale-[1.02] duration-300 cursor-pointer">
          <FaHandHoldingUsd className="text-indigo-600 text-3xl mb-3 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Settlement</h3>
          <p className="text-sm text-gray-500">Simplifies payments with minimum transactions.</p>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="flex gap-6 mt-12"
      >
        <Link to="/login">
          <button className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 hover:scale-105 transition-all duration-300 cursor-pointer">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="px-6 py-3 rounded-full bg-white border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-100 hover:scale-105 transition-all duration-300 cursor-pointer">
            Signup
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
