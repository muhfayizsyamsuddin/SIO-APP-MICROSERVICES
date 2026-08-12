import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await apiRequest('/users/admin/users');
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/admin/orders">All Orders</Link>
      </nav>

      <main>
        <h1>All Users</h1>

        {loading && <p>Loading users...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p>No users found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.address || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}

export default AdminUsersPage;