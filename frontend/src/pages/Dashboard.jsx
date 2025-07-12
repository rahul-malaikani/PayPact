import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:8000/api/groups/${user.id}/`)
      .then((res) => setGroups(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Groups</h2>
      {groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <Link to={`/group/${group.id}`}>{group.name}</Link>
            </li>
          ))}
        </ul>
      )}
      <br />
      <Link to="/create-group">+ Create New Group</Link>
    </div>
  );
}

export default Dashboard;
