import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:4000/api/admin/contacts',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // normalize: if your API returns the array as top‑level instead of under `.contacts`
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.contacts)
            ? res.data.contacts
            : [];

        setContacts(data);
      } catch (err) {
        console.error('Failed fetching contacts:', err);
        setError(
          err.response?.status
            ? `${err.response.status} ${err.response.statusText}`
            : err.message
        );
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  if (loading) return <p>Loading contacts…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

console.log('contacts', contacts);

  return (
    <div>
      <h1>Contact Submissions</h1>
      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Message</th>
              <th>Subscribed?</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c._id}>
                <td>{c.email}</td>
                <td>{c.message}</td>
                <td>{c.subscribe ? 'Yes' : 'No'}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
