import { useEffect, useState } from 'react';
import { fetchData } from "../lib/helpers";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsers = () => {
    setLoading(true);
    fetchData(`${process.env.REACT_APP_API_URL}/users`)
      .then((users) => {
        setLoading(false);
        setUsers(users);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Create date</th>
          </tr>
        </thead>
        {loading &&
        <tbody>
          <tr>
            <td colSpan="4">Loading...</td>
          </tr>
        </tbody>
        }
        {!loading &&<tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
        }
      </table>
    </div>
  )
}

export default Users;