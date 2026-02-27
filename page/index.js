// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');

  const createAccount = async () => {
    const res = await fetch('/api/createAccount', { method: 'POST' });
    const data = await res.json();
    setKey(data.key);
    setMessage('Account created! Save your key securely.');
  }

  const login = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });
    const data = await res.json();
    if (data.success) setMessage('Login successful!');
    else setMessage('Invalid key!');
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Casino Login / Create Account</h1>
      <input
        type="text"
        placeholder="Enter your 64-char key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={{ width: '400px' }}
      />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={createAccount}>Create Account</button>
        <button onClick={login} style={{ marginLeft: '1rem' }}>Login</button>
      </div>
      <p>{message}</p>
    </div>
  );
}