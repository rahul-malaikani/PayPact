import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "./Navbar";

function AddExpense() {
  const { id } = useParams(); // group ID
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [groupName, setGroupName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/add-expense/", {
        group: id,
        amount,
        description,
        paid_by: user.id,
      });

      toast.success("Expense added!");
      setAmount("");
      setDescription("");

      setTimeout(() => navigate(`/group/${id}`), 10); // redirect back to group page
    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense");
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/group/${id}/`)
      .then((res) => setGroupName(res.data.name))
      .catch((err) => console.error("Error fetching group name:", err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
            Add Expense to "{groupName}"
          </h2>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min={0.01}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="What was the expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddExpense;
