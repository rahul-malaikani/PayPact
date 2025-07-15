import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function GroupPage() {
  const { id } = useParams(); // group ID from URL
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [groupName, setGroupName] = useState("");


  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchExpenses();
    fetchGroupName();
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

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/add-expense/", {
        group: id,
        amount,
        description,
        paid_by: user.id,
      });

      setAmount("");
      setDescription("");
      setMessage("Expense added!");
      fetchExpenses();
    } catch (err) {
      console.error(err);
      setMessage("Failed to add expense");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Group: {groupName}</h2>

      <h3>Expenses:</h3>
      {expenses.length > 0 ? (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              ₹{expense.amount} – {expense.description} (Paid by {expense.paid_by_username})
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses!</p>
      )}

      <br />
      <Link to={`/group/${id}/add-expense`}>
        <button>+ Add Expense</button>
      </Link>{" "}
      &nbsp;
      <Link to={`/group/${id}/summary`}>
        <button>Settle up</button>
      </Link>
    </div>
  );
}

export default GroupPage;
