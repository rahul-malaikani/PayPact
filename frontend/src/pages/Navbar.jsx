import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect,} from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitial = () => user?.username?.charAt(0)?.toUpperCase() || "?";

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 bg-white shadow-sm z-50 py-3 px-6 flex justify-between items-center">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        <h1
          className="text-xl font-bold text-blue-700 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          PayPact
        </h1>
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm cursor-pointer"
          onClick={() => navigate("/create-group")}
        >
          + Create Group
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <span className="text-gray-600 hidden sm:inline">Hi, {user?.username}</span>
        <div
          className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer font-semibold"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {getInitial()}
        </div>

        {showDropdown && (
          <div className="absolute right-0 mt-12 bg-white border border-gray-200 rounded-md shadow-md w-32 z-50">
            <div className="px-4 py-2 text-gray-700 text-sm border-b">{user?.username}</div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
