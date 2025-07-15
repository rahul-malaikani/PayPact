import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [usernames, setUsernames] = useState([""]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleUsernameChange = (index, value) => {
    const newUsernames = [...usernames];
    newUsernames[index] = value;
    setUsernames(newUsernames);
  };

  const addUsernameField = () => {
    setUsernames([...usernames, ""]);
  };

  const removeUsernameField = (index) => {
    const newUsernames = usernames.filter((_, i) => i !== index);
    setUsernames(newUsernames);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Step 1: Validate all usernames before creating the group
    const userIds = [];

    for (const username of usernames) {
      try {
        const userRes = await axios.get(`http://localhost:8000/api/users/${username}/`);
        userIds.push(userRes.data.id);
      } catch {
        setMessage(`User '${username}' does not exist. Group not created.`);
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
    navigate("/dashboard");

  } catch (err) {
    console.error(err);
    setMessage("Server error. Please try again.");
  }
};


  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create New Group</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
        <br /><br />

        <h4>Add Members (by username)</h4>
        {usernames.map((uname, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder={`Username ${i + 1}`}
              value={uname}
              onChange={(e) => handleUsernameChange(i, e.target.value)}
              required
              style={{ marginRight: "10px" }}
            />
            <button
              type="button"
              
              onClick={() => removeUsernameField(i)}
              disabled={usernames.length === 1}
            >
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addUsernameField}>+ Add More</button>
        <br /><br />
        <button type="submit">Create Group</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreateGroup;
