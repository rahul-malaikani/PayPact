import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddExpense() {
  const { id } = useParams(); // group ID
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
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

      setMessage("Expense added!");
      setTimeout(() => navigate(`/group/${id}`), 1000); // redirect back to group page
    } catch (err) {
      console.error(err);
      setMessage("Failed to add expense");
    }
  };

  useEffect(() => {
  axios.get(`http://localhost:8000/api/group/${id}/`)
    .then(res => setGroupName(res.data.name))
    .catch(err => console.error("Error fetching group name:", err));
}, []);


  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add Expense to Group: {groupName}</h2>
      <form onSubmit={handleAddExpense}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min={0.01}
          step="0.01"
        />
        <br /><br />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Add Expense</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default AddExpense;
