import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function GroupSummary() {
  const { id } = useParams(); // group id
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  useEffect(() => {
  async function fetchSummary() {
    try {
      const [expRes, membersRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/expenses/${id}/`),
        axios.get(`http://localhost:8000/api/groups/${id}/members/`)
      ]);

      const expenses = expRes.data;
      const memberUsernames = membersRes.data.map(m => m.username);

      const membersPaid = {};
      let totalAmount = 0;

      // Count how much each paid
      expenses.forEach(exp => {
        const payer = exp.paid_by_username;
        const amount = parseFloat(exp.amount);

        membersPaid[payer] = (membersPaid[payer] || 0) + amount;
        totalAmount += amount;
      });

      // Include users who didn’t pay
      memberUsernames.forEach(username => {
        if (!(username in membersPaid)) membersPaid[username] = 0;
      });

      const share = totalAmount / memberUsernames.length;

      // Net balance = paid - share
      const balances = {};
      memberUsernames.forEach(username => {
        balances[username] = membersPaid[username] - share;
      });

      // Now calculate who owes whom
      const owes = [];

      const debtors = Object.entries(balances)
        .filter(([_, amt]) => amt < 0)
        .sort((a, b) => a[1] - b[1]); // most negative first

      const creditors = Object.entries(balances)
        .filter(([_, amt]) => amt > 0)
        .sort((a, b) => b[1] - a[1]); // most positive first

      let i = 0, j = 0;
      while (i < debtors.length && j < creditors.length) {
        const [debtor, debtAmt] = debtors[i];
        const [creditor, credAmt] = creditors[j];

        const settled = Math.min(-debtAmt, credAmt);
        owes.push({
          from: debtor,
          to: creditor,
          amount: settled.toFixed(2),
        });

        balances[debtor] += settled;
        balances[creditor] -= settled;

        if (balances[debtor] === 0) i++;
        if (balances[creditor] === 0) j++;
      }

      setSummary(owes);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  fetchSummary();
}, [id]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Group Summary</h2>
      {loading ? (
        <p>Loading...</p>
      ) : summary.length === 0 ? (
        <p>Everyone is settled up!</p>
      ) : (
        <ul>
            {summary.map((item, index) => {
            const from = item.from === username ? "You" : item.from;
            const to = item.to === username ? "You" : item.to;

            // If "You" is the subject, use "owe" instead of "owes"
            const verb = from === "You" ? "owe" : "owes";

            return (
                <li key={index}>
                <strong>{from}</strong> {verb} <strong>{to}</strong> ₹{item.amount}
                </li>
            );
            })}
        </ul>
      )}
    </div>
  );
}

export default GroupSummary;
