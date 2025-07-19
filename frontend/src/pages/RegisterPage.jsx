import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import api from "../api/axios.js";

function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("register/", formData);
      console.log("Registered:", res.data);
      toast.success("Registered successfully!");
      setMessage("Registered! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
      setMessage("Registration failed. Try a different username.");
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-200 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="headings text-2xl font-bold text-center text-indigo-600 mb-6">Signup to PayPact</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300  rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition cursor-pointer"
          >
            Register
          </button>

          <button
            type="button"
            onClick={goToLogin}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition cursor-pointer"
          >
            Back to Login
          </button>
        </form>

        {message && <p className="text-sm text-center mt-4 text-gray-600">{message}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;
