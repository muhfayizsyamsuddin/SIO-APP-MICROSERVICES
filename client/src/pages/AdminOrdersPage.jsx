import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';

function formatRupiah(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await apiRequest('/orders/admin');
        setOrders(data);
      } catch (error) {
        console.error('Failed to load admin orders:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/menus">Menu</Link>
        <Link to="/orders">Your Orders</Link>
      </nav>

      <main>
        <h1>All Orders</h1>

        {loading && <p>Loading orders...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p>No orders found.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const total =
                  order.OrderMenus?.reduce(
                    (sum, item) =>
                      sum +
                      Number(item.priceAtOrder) *
                        Number(item.quantity),
                    0
                  ) || 0;

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>

                    <td>{order.UserId}</td>

                    <td>
                      {order.createdAt}
                    </td>

                    <td>
                      {order.statusOrder}
                    </td>

                    <td>
                      {order.OrderMenus?.map((item) => (
                        <div key={item.id}>
                          Menu ID: {item.MenuId} —
                          Quantity: {item.quantity}
                        </div>
                      ))}
                    </td>

                    <td>
                      {formatRupiah(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}

export default AdminOrdersPage;