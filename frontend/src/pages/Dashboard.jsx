import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import api from "../api/axios";

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    api
      .get(`groups/${user.id}/`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
})
      .then((res) => setGroups(res.data))
      .catch((err) => console.error(err));
  }, []);


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="spacing text-4xl font-bold text-gray-800">Your Groups</h2>
            <p className="text-gray-500 mt-2">Manage and split your expenses effortlessly!</p>
          </div>

          {groups.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-gray-500 mb-4">You haven't created any groups yet.</p>
              <Link to="/create-group">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                  Create Your First Group
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((group) => (
                <Link
                  to={`/group/${group.id}`}
                  key={group.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl hover:bg-blue-50 transition duration-300 p-6 flex items-center space-x-4"
                >
                  <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl">
                    {group.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                    <p className="text-sm text-gray-500">Click to view expenses</p>
                    
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/create-group">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                + Create New Group
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
