import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../api/client';

function formatRupiah(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const loadMenus = async () => {
      setLoading(true);
      setError('');

      try {
        const query = searchQuery
          ? `?search=${encodeURIComponent(searchQuery)}`
          : '';

        const data = await apiRequest(`/menus${query}`);

        setMenus(data);
      } catch (error) {
        console.error('Failed to load menus:', error);
        setError(error.message);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, [searchQuery]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleOrder = async (menuId) => {
    try {
        await apiRequest(`/orders/${menuId}`, {
        method: 'POST',
        });

        alert('Order berhasil dibuat!');
    } catch (error) {
        alert(error.message);
    }
  };

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/orders">Your Orders</Link>
      </nav>

      <main>
        <h1>Our Menus</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search menu..."
          />

          <button type="submit">
            SEARCH
          </button>
        </form>

        {error && (
          <p>
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading menus...</p>
        ) : menus.length === 0 ? (
          <p>No menus found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Menu</th>
                <th>Description</th>
                <th>Price</th>
                <th>Status</th>
                <th>Order</th>
              </tr>
            </thead>

            <tbody>
              {menus.map((menu, index) => (
                <tr key={menu.id}>
                  <td>{index + 1}</td>

                  <td>
                    <strong>{menu.name}</strong>

                    <br />

                    {menu.imageUrl && (
                      <img
                        src={menu.imageUrl}
                        alt={menu.name}
                        width="120"
                      />
                    )}
                  </td>

                  <td>
                    {menu.description}
                  </td>

                  <td>
                    {formatRupiah(menu.price)}
                  </td>

                  <td>
                    {menu.statusMenu}
                  </td>

                  <td>
                    <button
                        type="button"
                        onClick={() => handleOrder(menu.id)}
                    >
                        Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}

export default MenuPage;