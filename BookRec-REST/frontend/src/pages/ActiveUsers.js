// ActiveUsers.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/activeUsers');
        setActiveUsers(response.data);
      } catch (error) {
        console.error('Error fetching active users:', error);
      }
    };

    fetchActiveUsers();
  }, []); // Fetch active users only once when the component mounts

  return (
    <div>
      <h2>Active Users:</h2>
      <ul>
        {activeUsers.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsers;
