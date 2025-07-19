import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import api from "../api/axios";
import toast from "react-hot-toast";

function GroupSummary() {
  const { id } = useParams();
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [paidSplits, setPaidSplits] = useState(new Set());
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  const fetchSummary = async () => {
    try {
      const groupRes = await api.get(`group/${id}/`);
      setGroupName(groupRes.data.name);

      const [expRes, membersRes] = await Promise.all([
        api.get(`expenses/${id}/`),
        api.get(`groups/${id}/members/`)
      ]);

      const expenses = expRes.data;
      const members = membersRes.data;
      const memberIdMap = {};
      members.forEach(m => { memberIdMap[m.username] = m.id });

      const membersPaid = {};
      let totalAmount = 0;

      expenses.forEach(exp => {
        membersPaid[exp.paid_by_username] = (membersPaid[exp.paid_by_username] || 0) + parseFloat(exp.amount);
        totalAmount += parseFloat(exp.amount);
      });

      members.forEach(m => {
        if (!(m.username in membersPaid)) membersPaid[m.username] = 0;
      });

      const share = totalAmount / members.length;
      const balances = {};
      members.forEach(m => {
        balances[m.username] = membersPaid[m.username] - share;
      });

      const owes = [];
      const debtors = Object.entries(balances).filter(([_, amt]) => amt < 0).sort((a, b) => a[1] - b[1]);
      const creditors = Object.entries(balances).filter(([_, amt]) => amt > 0).sort((a, b) => b[1] - a[1]);

      let i = 0, j = 0;
      while (i < debtors.length && j < creditors.length) {
        const [debtor, debtAmt] = debtors[i];
        const [creditor, credAmt] = creditors[j];
        const settled = Math.min(-debtAmt, credAmt);

        owes.push({
          from: debtor,
          to: creditor,
          from_id: memberIdMap[debtor],
          to_id: memberIdMap[creditor],
          amount: settled.toFixed(2)
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
      toast.error("You are not authorized to view this group.");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchSummary();
  }, []);

  const handlePay = async (item) => {
    try {
      const res = await api.post('/createpaymentorder/', {
        payer_id: item.from_id,
        payee_id: item.to_id,
        group_id: id,
        amount: item.amount
      });

      const { amount, order_id, currency, payment_id } = res.data;

      const options = {
        key: "rzp_test_G820zxtlCQRG7A",
        amount: amount,
        currency: currency,
        name: "PayPact",
        order_id: order_id,
        description: `Payment from ${item.from} to ${item.to}`,
        prefill: {
          name: user.username,
          email: user.email || '',
          contact: user.phone || ''
        },
        handler: async function(response) {
          try {
            await api.post('/verifypayment/', {
              razorpay_order_id: order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              payment_id
            });
            toast.success("Payment successful!");

            // mark this split as paid locally
            setPaidSplits(prev => new Set(prev).add(`${item.from_id}_${item.to_id}`));

            fetchSummary();
          } catch (err) {
            toast.error("Payment verification failed");
            console.error(err);
          }
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function() {
            toast.error("Payment cancelled by user");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Summary</h2>
            <p className="text-gray-500 mt-1">
              Track how much you owe and what others owe you in <strong>{groupName}</strong>.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : summary.length === 0 ? (
            <div className="text-center text-green-700 mt-6">
              <p className="text-xl font-semibold">🎉 Everyone is settled up! 🎉</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {summary.map((item, index) => {
                const from = item.from === username ? "You" : item.from;
                const to = item.to === username ? "You" : item.to;
                const verb = from === "You" ? "owe" : "owes";
                const isCurrentUser = item.from === username;
                const splitKey = `${item.from_id}_${item.to_id}`;
                const isPaid = paidSplits.has(splitKey);

                return (
                  <li key={index} className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-indigo-700">{from}</span> {verb} <span className="font-semibold text-indigo-700">{to}</span> ₹{item.amount}
                    </div>
                    <div className="flex items-center gap-3">
                      {isPaid ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Paid</span>
                      ) : (
                        isCurrentUser && (
                          <button
                            onClick={() => handlePay(item)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                          >
                            Pay Now
                          </button>
                        )
                      )}
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



// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Navbar from "./Navbar";
// import api from "../api/axios";
// import toast from "react-hot-toast";

// function GroupSummary() {
//   const { id } = useParams(); // group id
//   const [summary, setSummary] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [groupName, setGroupName] = useState("");
//   const [memberStatuses, setMemberStatuses] = useState({}); // placeholder for paid/unpaid status
//   const navigate=useNavigate()

//   const user = JSON.parse(localStorage.getItem("user"));
//   const username = user?.username;

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     async function fetchSummary() {
//       try {
//   // Check if user has access to this group
//         const groupRes = await api.get(`group/${id}/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('access_token')}`
//           }
//         });

//         setGroupName(groupRes.data.name);
//           const [expRes, membersRes] = await Promise.all([
//             api.get(`expenses/${id}/`, {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem('access_token')}`
//               }
//             }),
//             api.get(`groups/${id}/members/`, {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem('access_token')}`
//               }
//             })
//           ]);

//         const expenses = expRes.data;
//         const memberUsernames = membersRes.data.map(m => m.username);

//         const membersPaid = {};
//         let totalAmount = 0;

//         // Count how much each person paid
//         expenses.forEach(exp => {
//           const payer = exp.paid_by_username;
//           const amount = parseFloat(exp.amount);

//           membersPaid[payer] = (membersPaid[payer] || 0) + amount;
//           totalAmount += amount;
//         });

//         // Include users who didn’t pay anything
//         memberUsernames.forEach(username => {
//           if (!(username in membersPaid)) membersPaid[username] = 0;
//         });

//         const share = totalAmount / memberUsernames.length;

//         // Net balance = paid - share
//         const balances = {};
//         memberUsernames.forEach(username => {
//           balances[username] = membersPaid[username] - share;
//         });

//         // Now calculate who owes whom
//         const owes = [];

//         const debtors = Object.entries(balances)
//           .filter(([_, amt]) => amt < 0)
//           .sort((a, b) => a[1] - b[1]); // most negative first

//         const creditors = Object.entries(balances)
//           .filter(([_, amt]) => amt > 0)
//           .sort((a, b) => b[1] - a[1]); // most positive first

//         let i = 0, j = 0;
//         while (i < debtors.length && j < creditors.length) {
//           const [debtor, debtAmt] = debtors[i];
//           const [creditor, credAmt] = creditors[j];

//           const settled = Math.min(-debtAmt, credAmt);
//           owes.push({
//             from: debtor,
//             to: creditor,
//             from_id: memberUsernames[debtor],  // map this earlier
//             to_id: memberUsernames[creditor],
//             amount: settled.toFixed(2)
//           });
//           balances[debtor] += settled;
//           balances[creditor] -= settled;

//           if (balances[debtor] === 0) i++;
//           if (balances[creditor] === 0) j++;
//         }

//         // Placeholder status for paid/unpaid (we can replace this with real logic later)
//         const mockStatus = {};
//         memberUsernames.forEach(u => {
//           mockStatus[u] = Math.random() > 0.5 ? "Paid" : "Unpaid"; // simulate for now
//         });
//         setMemberStatuses(mockStatus);

//         setSummary(owes);
//         setLoading(false);
//       } catch (err) {
//         setLoading(false)
//         toast.error("You are not authorized to view this group. Redirecting!");
//         navigate("/dashboard");
//         console.error(err);
//       }
//     }

//     fetchSummary();
//   }, []);

//   const handlePay=(e)=>{
//     var options={
//       key:"rzp_test_G820zxtlCQRG7A",
//       key_secret:"W1fY0MmdD7ueo4koWER26ULE",
//       amount:e.amount *100,
//       currency:"INR",
//       name:"PayPact",
//       description:"For testing",
    
//       handler: function(response){
//         alert(response.razorpay_payment_id);
//       },
//       prefill:{
//         //should be the details of the user
//         name:"",
//         email:"",
//         contact:""
//       },
//       notes:{
//         address:"Razorpay corporate office"
//       },
//       theme:{
//         color:"3399cc"
//       },
//       method: {
//     card: {
//       networks: ['visa', 'mastercard']  // Explicitly allow Visa/Mastercard
//     }}
//     };
//     var pay=new window.Razorpay(options)
//     pay.open();
//   }
//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 p-6 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-900">Summary</h2>
//             <p className="text-gray-500 mt-1">Track how much you owe and what others owe you in <strong>{groupName}</strong>.</p>
//           </div>

//           {loading ? (
//             <p className="text-center text-gray-500">Loading...</p>
//           ) : summary.length === 0 ? (
//             <div className="text-center text-green-700 mt-6">
//               <p className="text-xl font-semibold">🎉 Everyone is settled up! 🎉</p>
//               <p className="text-sm mt-1 text-green-500">No pending payments in <strong>{groupName}</strong>.</p>
//             </div>
//           ) : (
//             <ul className="space-y-4">
//               {summary.map((item, index) => {
//                 const from = item.from === username ? "You" : item.from;
//                 const to = item.to === username ? "You" : item.to;

//                 const verb = from === "You" ? "owe" : "owes";
//                 const isCurrentUser = item.from === username;

//                 return (
//                   <li
//                     key={index}
//                     className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between items-center"
//                   >
//                     <div className="text-gray-700 font-medium mb-2 sm:mb-0">
//                       <span className="text-indigo-700 font-semibold">{from}</span> {verb} <span className="text-indigo-700 font-semibold">{to}</span> ₹{item.amount}
//                     </div>

//                     <div className="flex items-center gap-3">
//                       {/* Show Pay Now for current user */}
//                       {isCurrentUser &&  (
//                         <button onClick={() => handlePay(item)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm shadow cursor-pointer">
//                           Pay Now
//                         </button>
//                       )}

//                       {/* Status badge */}
//                       <span
//                         className={`px-2 py-1 text-xs font-semibold rounded ${
//                           memberStatuses[item.from] === "Paid"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-600"
//                         }`}
//                       >
//                         {memberStatuses[item.from] || "Unpaid"}
//                       </span>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default GroupSummary;
