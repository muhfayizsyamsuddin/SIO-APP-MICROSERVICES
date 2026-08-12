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

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      const data = await apiRequest('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      await loadOrders();

      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleQuantity = async (orderMenuId, quantity) => {
    if (quantity < 1) return;

    try {
      await apiRequest(`/orders/${orderMenuId}/edit`, {
        method: 'POST',
        body: JSON.stringify({
          quantity,
        }),
      });

      await loadOrders();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (orderMenuId) => {
    try {
      await apiRequest(`/orders/${orderMenuId}/delete`, {
        method: 'POST',
      });

      await loadOrders();
    } catch (error) {
      setError(error.message);
    }
  };

  
  const handleDownloadPdf = async (orderId) => {
      try {
          const token = localStorage.getItem('access_token');
          
          const response = await fetch(
              `http://localhost:3000/orders/${orderId}/pdf`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    
    if (!response.ok) {
        throw new Error('Gagal mengunduh invoice');
    }
    
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `order_${orderId}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    
    link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        setError(error.message);
    }
  };

    const handlePay = async (orderId) => {
        try {
            await apiRequest(`/orders/${orderId}/pay`, {
            method: 'POST',
            });

            await loadOrders();

            await handleDownloadPdf(orderId);
        } catch (error) {
            setError(error.message);
        }
    };

return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/menus">Menu</Link>
      </nav>

      <main>
        <h1>Your Orders</h1>

        {loading && <p>Loading orders...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p>No orders yet.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Menu</th>
                <th>Time</th>
                <th>Quantity</th>
                <th>Price/item</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, orderIndex) =>
                order.OrderMenus?.map((orderMenu, menuIndex) => (
                  <tr key={orderMenu.id}>
                    <td>{orderIndex + 1}</td>

                    <td>
                      {orderMenu.Menu?.name}

                      <br />

                      {orderMenu.Menu?.imageUrl && (
                        <img
                          src={orderMenu.Menu.imageUrl}
                          alt={orderMenu.Menu.name}
                          width="120"
                        />
                      )}
                    </td>

                    <td>
                      {order.formatDate || order.createdAt}
                    </td>

                    <td>
                      <button
                        type="button"
                        disabled={orderMenu.quantity <= 1}
                        onClick={() =>
                          handleQuantity(
                            orderMenu.id,
                            orderMenu.quantity - 1
                          )
                        }
                      >
                        -
                      </button>

                      <span style={{ margin: '0 10px' }}>
                        {orderMenu.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantity(
                            orderMenu.id,
                            orderMenu.quantity + 1
                          )
                        }
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(orderMenu.id)
                        }
                      >
                        Delete
                      </button>
                    </td>

                    <td>
                      {formatRupiah(orderMenu.priceAtOrder)}
                    </td>

                    <td>
                      {order.statusOrder}
                    </td>

                    <td>
                      {menuIndex === 0 &&
                        order.statusOrder === 'active' && (
                          <button
                            type="button"
                            onClick={() =>
                              handlePay(order.id)
                            }
                          >
                            Pay
                          </button>
                        )}

                      {menuIndex === 0 &&
                        order.statusOrder === 'completed' && (
                          <span>Paid</span>
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}

export default OrdersPage;