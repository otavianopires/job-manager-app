import { useEffect, useState } from 'react';
import { fetchData } from "../lib/helpers";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsers = () => {
    setLoading(true);
    fetchData(`${process.env.REACT_APP_API_URL}/clients`)
      .then((clients) => {
        setLoading(false);
        setClients(clients.data);
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
      <h2>Clients</h2>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
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
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.attributes.name}</td>
                <td>{client.attributes.address}</td>
              </tr>
            ))}
          </tbody>
          }
        </table>
      </div>
    </div>
  )
}

export default Clients;