import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";


function GroupPage() {
  const { id } = useParams(); // group ID from URL
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchExpenses();
    fetchGroupName();
    fetchGroupMembers();
    fetchAnalytics();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/expenses/${id}/`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGroupName = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/group/${id}/`);
      setGroupName(res.data.name);
    } catch (err) {
      console.error("Error fetching group name", err);
      setGroupName("Unknown Group");
    }
  };

  const fetchGroupMembers = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/api/groups/${id}/members/`);
    setMembers(res.data);
  } catch (err) {
    console.error("Error fetching group members", err);
  }
};

const fetchAnalytics = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/api/group/${id}/analytics/`);
    setAnalytics(res.data);
  } catch (err) {
    console.error("Error fetching analytics", err);
  }
};

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-7">
            <h2 className="spacing text-4xl font-bold text-gray-800">{groupName}</h2>
            <p className="text-gray-500 mt-2">Track shared expenses in this group</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow ">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Group Members</h3>
            <div className="flex flex-wrap gap-3">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {member.username}
                </div>
              ))}
            </div>
          </div>

          {analytics && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Analytics</h3>
              <p className="text-gray-600">💰 Total Spent: <strong>₹{analytics.total_spent}</strong></p>
              <ul className="mt-3 text-sm text-gray-700">
                {Object.entries(analytics.user_contributions).map(([user, amount]) => (
                  <li key={user} className="flex justify-between">
                    <span>{user}</span>
                    <span className="font-medium">₹{amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}



          {expenses.length === 0 ? (
            <div className="text-center text-gray-500 mt-6">
              <p className="text-lg">No expenses yet in this group.</p>
              <p className="text-sm mt-1">Start by adding your first shared expense 💸</p>
            </div>

          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {expenses.map((expense) => (
    <div
      key={expense.id}
      className="relative bg-white rounded-xl shadow-md hover:shadow-xl hover:bg-blue-50 transition duration-300 p-6 flex items-start space-x-4"
    >
      {/* Icon Circle */}
      <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-sm">
        ₹
      </div>

      {/* Expense Details */}
      <div className="flex flex-col">
        <h3 className="text-md text-gray-700 font-semibold">{expense.description}</h3>
        <p className="text-lg text-gray-900 font-bold mt-1">₹{expense.amount}</p>
        <p className="text-sm text-gray-500 mt-1">
          Paid by <span className="font-medium">{expense.paid_by_username}</span>
        </p>
        <p className="text-xs text-gray-300 mt-2">
          {new Date(expense.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  ))}
</div>

          )}

          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            <Link to={`/group/${id}/add-expense`}>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                + Add Expense
              </button>
            </Link>
            <Link to={`/group/${id}/summary`}>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                Settle up
              </button>
            </Link>
          </div>

          {message && (
            <p className="mt-6 text-center text-sm text-green-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default GroupPage;
