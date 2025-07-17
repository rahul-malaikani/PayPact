import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

function GroupSummary() {
  const { id } = useParams(); // group id
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [memberStatuses, setMemberStatuses] = useState({}); // placeholder for paid/unpaid status

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  useEffect(() => {
    async function fetchSummary() {
      try {
        // Fetch expenses and group members
        const [expRes, membersRes, groupRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/expenses/${id}/`),
          axios.get(`http://localhost:8000/api/groups/${id}/members/`),
          axios.get(`http://localhost:8000/api/group/${id}/`)
        ]);

        setGroupName(groupRes.data.name);

        const expenses = expRes.data;
        const memberUsernames = membersRes.data.map(m => m.username);

        const membersPaid = {};
        let totalAmount = 0;

        // Count how much each person paid
        expenses.forEach(exp => {
          const payer = exp.paid_by_username;
          const amount = parseFloat(exp.amount);

          membersPaid[payer] = (membersPaid[payer] || 0) + amount;
          totalAmount += amount;
        });

        // Include users who didn’t pay anything
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

        // Placeholder status for paid/unpaid (we can replace this with real logic later)
        const mockStatus = {};
        memberUsernames.forEach(u => {
          mockStatus[u] = Math.random() > 0.5 ? "Paid" : "Unpaid"; // simulate for now
        });
        setMemberStatuses(mockStatus);

        setSummary(owes);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    fetchSummary();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Summary</h2>
            <p className="text-gray-500 mt-1">Track how much you owe and what others owe you in <strong>{groupName}</strong>.</p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : summary.length === 0 ? (
            <div className="text-center text-green-700 mt-6">
              <p className="text-xl font-semibold">🎉 Everyone is settled up! 🎉</p>
              <p className="text-sm mt-1 text-green-500">No pending payments in <strong>{groupName}</strong>.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {summary.map((item, index) => {
                const from = item.from === username ? "You" : item.from;
                const to = item.to === username ? "You" : item.to;

                const verb = from === "You" ? "owe" : "owes";
                const isCurrentUser = item.from === username;

                return (
                  <li
                    key={index}
                    className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between items-center"
                  >
                    <div className="text-gray-700 font-medium mb-2 sm:mb-0">
                      <span className="text-indigo-700 font-semibold">{from}</span> {verb} <span className="text-indigo-700 font-semibold">{to}</span> ₹{item.amount}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Show Pay Now for current user */}
                      {isCurrentUser && (
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm shadow cursor-pointer">
                          Pay Now
                        </button>
                      )}

                      {/* Status badge */}
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          memberStatuses[item.from] === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {memberStatuses[item.from] || "Unpaid"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default GroupSummary;
