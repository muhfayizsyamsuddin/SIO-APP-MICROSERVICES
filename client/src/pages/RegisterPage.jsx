import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    photoUrl: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    try {
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          role: 'customer',
        }),
      });

      setSuccess('Registration successful. Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
    <nav>
      <Link to="/">Home</Link>
    </nav>

    <main>
      <div className="auth-card">
      <h1>Register</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <br />
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="photoUrl">Photo URL</label>
          <br />
          <input
            id="photoUrl"
            name="photoUrl"
            type="url"
            value={form.photoUrl}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="address">Address</label>
          <br />
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <p className="auth-footer">
        Already have an account?{' '}
        <Link to="/login">Login here</Link>
      </p>
      </div>
    </main>
    </>
  );
}

export default RegisterPage;