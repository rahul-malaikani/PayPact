import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import GroupPage from "./pages/GroupPage";
import CreateGroupPage from "./pages/CreateGroupPage";
import GroupSummary from "./pages/GroupSummary";
import AddExpense from "./pages/AddExpense";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/group/:id" element={<GroupPage />} />
      <Route path="/create-group" element={<CreateGroupPage />} />
      <Route path="/group/:id/add-expense" element={<AddExpense/>} />
      <Route path="/group/:id/summary" element={<GroupSummary/>} />
    </Routes>
  );
}

export default App;
