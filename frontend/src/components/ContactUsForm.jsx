import { useState } from 'react';
import axios from 'axios';

export default function ContactUsForm() {
  const [form, setForm] = useState({ email: '', message: '', subscribe: false });
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/contact", form);
      setStatus("Thank you for your message!");
      setForm({ email: "", message: "", subscribe: false });
    } catch (err) {
      setStatus(`Error: ${err.message} (code: ${err.code})`);
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '500px',
        margin: '40px auto',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#1e1e1e',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        color: '#eee'
      }}
    >
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px 10px',
            border: '1px solid #444',
            borderRadius: '4px',
            backgroundColor: '#2b2b2b',
            color: '#eee',
            fontSize: '14px'
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Your Question:</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          style={{
            width: '100%',
            padding: '8px 10px',
            border: '1px solid #444',
            borderRadius: '4px',
            backgroundColor: '#2b2b2b',
            color: '#eee',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </div>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <label style={{ fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="subscribe"
            checked={form.subscribe}
            onChange={handleChange}
            style={{ marginRight: '6px' }}
          />
          Get updates and promotions
        </label>
      </div>
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          fontWeight: '600',
          color: '#1e1e1e',
          backgroundColor: '#eee',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Send
      </button>
      {status && (
        <p style={{ marginTop: '15px', fontSize: '14px', color: status.startsWith('Error') ? '#ff6b6b' : '#6bff95' }}>
          {status}
        </p>
      )}
    </form>
  );
}
