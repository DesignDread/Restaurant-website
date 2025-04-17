import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/reservations');
      setReservations(response.data);
    } catch (err) {
      setError('Error fetching reservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/reservations/${id}`, { status: newStatus });
      setReservations(reservations.map(r =>
        r._id === id ? { ...r, status: newStatus } : r
      ));
    } catch (err) {
      setError('Error updating reservation status');
      console.error(err);
    }
  };

  const formatDate = dateString => new Date(dateString).toLocaleDateString();

  if (loading) return <div>Loading...</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h2>Manage Reservations</h2>
      <button onClick={fetchReservations} className="refresh-btn">Refresh</button>

      <div className="reservations-list">
        <h3>All Reservations</h3>
        {reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Date</th><th>Time</th>
                <th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r._id} className={`status-${r.status}`}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{formatDate(r.date)}</td>
                  <td>{r.time}</td>
                  <td>{r.status}</td>
                  <td>
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(r._id, 'approved')}
                          className="approve-btn"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(r._id, 'rejected')}
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
