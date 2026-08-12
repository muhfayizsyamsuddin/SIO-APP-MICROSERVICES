import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function HomePage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <nav>
        <div className="nav-links">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/menus">Our Menus</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/orders">Orders</Link>
            {user.role === 'admin' && (
                <>
                    <Link to="/admin/orders">All Orders</Link>
                    <Link to="/admin/users">All Users</Link>
                </>
            )}
          </>
        )}
        </div>
        {user && (
          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </nav>

      <main>
        <h1>Home Page</h1>

        <h2>
          Welcome, {user ? user.username : 'Guest'}
        </h2>

        <p>
          <strong>SIO (SimpleOrder)</strong> adalah aplikasi pemesanan makanan
          dan minuman secara online yang dirancang untuk memberikan pengalaman
          order yang cepat, simpel, dan efisien langsung dari restoran pilihan
          Anda.
        </p>

        <p>
          Aplikasi ini mendukung sistem pemesanan modern dengan fitur-fitur
          berikut:
        </p>

        <ul>
          <li>Pendaftaran & login user</li>
          <li>Manajemen profil pengguna (alamat, foto)</li>
          <li>Pilihan menu lengkap dengan ketersediaan (tersedia/habis)</li>
          <li>Proses order yang praktis</li>
          <li>Status pesanan (active, completed)</li>
          <li>Invoice digital otomatis setelah pembayaran via PDFKit</li>
        </ul>
      </main>
    </>
  );
}

export default HomePage;