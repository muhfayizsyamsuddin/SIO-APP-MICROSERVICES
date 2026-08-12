import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiRequest('/users/profile');
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/menus">Menu</Link>
        <Link to="/orders">Your Orders</Link>
      </nav>

      <main>
        <h1>My Profile</h1>

        {loading && <p>Loading profile...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && profile && (
          <div>
            {profile.photoUrl && (
              <div>
                <img
                  src={profile.photoUrl}
                  alt={profile.username}
                  width="150"
                />
              </div>
            )}

            <p>
              <strong>Username:</strong> {profile.username}
            </p>

            <p>
              <strong>Email:</strong> {profile.email}
            </p>

            <p>
              <strong>Role:</strong> {profile.role}
            </p>

            <p>
              <strong>Address:</strong>{' '}
              {profile.address || '-'}
            </p>
          </div>
        )}
      </main>
    </>
  );
}

export default ProfilePage;