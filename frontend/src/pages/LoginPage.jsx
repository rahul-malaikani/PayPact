import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login/", formData);
      const user = res.data;

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome ${user.username}!`)
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid username or password")
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-slate-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="headings text-2xl font-bold text-center text-indigo-600 mb-6">Login to PayPact</h2>

        

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition cursor-pointer"
            >
              Register
            </button>
          </div>
          {/* {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )} */}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
