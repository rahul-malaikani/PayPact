import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function GroupPage() {
  const { id } = useParams(); // group ID from URL
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/expenses/${id}/`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
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
      <h2>Group ID: {id}</h2>

      <h3>Expenses:</h3>
      {expenses.length>0 ? (
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            ₹{expense.amount} – {expense.description} (Paid by {expense.paid_by_username})
          </li>
        ))}
      </ul>
        ):(<p>No expenses!</p>)}
      
      
      <hr />

      <h3>Add Expense</h3>
      <form onSubmit={handleAddExpense}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0.01"
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

export default GroupPage;
