import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "./Navbar";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [usernames, setUsernames] = useState([""]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Update username field at given index
  const handleUsernameChange = (index, value) => {
    const newUsernames = [...usernames];
    newUsernames[index] = value;
    setUsernames(newUsernames);
  };

  // Add a new empty username input
  const addUsernameField = () => {
    setUsernames([...usernames, ""]);
  };

  // Remove the username field at given index
  const removeUsernameField = (index) => {
    const newUsernames = usernames.filter((_, i) => i !== index);
    setUsernames(newUsernames);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userIds = [];

      // Step 1: Validate all usernames before creating the group
      for (const username of usernames) {
        try {
          const userRes = await axios.get(`http://localhost:8000/api/users/${username}/`);
          userIds.push(userRes.data.id);
        } catch {
          setMessage(`User '${username}' does not exist. Group not created.`);
          toast.error("User does not exist");
          return;
        }
      }

      // Step 2: Create the group only if all usernames are valid
      const res = await axios.post("http://localhost:8000/api/create-group/", {
        name: groupName,
        created_by: user.id,
      });

      const groupId = res.data.id;

      // Step 3: Add current user to group
      await axios.post("http://localhost:8000/api/add-member/", {
        group: groupId,
        user: user.id,
      });

      // Step 4: Add validated users to group
      for (const userId of userIds) {
        await axios.post("http://localhost:8000/api/add-member/", {
          group: groupId,
          user: userId,
        });
      }

      setMessage("Group created successfully!");
      toast.success("Group created!");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
            Create New Group
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300  rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {/* Username input fields */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Add Members (by username)
              </label>
              <div className="space-y-3">
                {usernames.map((uname, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder={`Username ${i + 1}`}
                      value={uname}
                      onChange={(e) => handleUsernameChange(i, e.target.value)}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeUsernameField(i)}
                      disabled={usernames.length === 1}
                      className={`px-3 py-1 text-sm cursor-pointer rounded ${
                        usernames.length === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addUsernameField}
                className="mt-4 px-3 py-1.5 bg-gray-100 text-indigo-600 rounded-md text-sm font-medium shadow-sm border border-gray-300 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
              >
                + Add Member
              </button>

            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition cursor-pointer"
            >
              Create Group
            </button>

            {/* Optional error message */}
            {message && (
              <p className="text-center text-red-500 text-sm">{message}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateGroup;
