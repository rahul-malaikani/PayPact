import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [usernames, setUsernames] = useState([""]); // array of usernames
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create the group
      const res = await axios.post("http://localhost:8000/api/create-group/", {
        name: groupName,
        created_by: user.id,
      });
      const groupId = res.data.id;

      // 2. Add current user to group
      await axios.post("http://localhost:8000/api/add-member/", {
        group: groupId,
        user: user.id,
      });

      // 3. Add other users by username
      for (const username of usernames) {
        const userRes = await axios.get(`http://localhost:8000/api/users/${username}/`);
        const userId = userRes.data.id;

        await axios.post("http://localhost:8000/api/add-member/", {
          group: groupId,
          user: userId,
        });
      }

      setMessage("Group created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Error creating group");
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
          <input
            key={i}
            type="text"
            placeholder={`Username ${i + 1}`}
            value={uname}
            onChange={(e) => handleUsernameChange(i, e.target.value)}
            required
          />
        ))}
        <br /><br />
        <button type="button" onClick={addUsernameField}>+ Add More</button>
        <br /><br />
        <button type="submit">Create Group</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreateGroup;
