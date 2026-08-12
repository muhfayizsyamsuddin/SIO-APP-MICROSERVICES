import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/');
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
        <h1>Login</h1>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Register</Link>
        </p>
        </div>
      </main>
    </>
  );
}

export default LoginPage;