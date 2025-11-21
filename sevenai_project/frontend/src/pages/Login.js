import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Login page component.
 *
 * Provides a form for the user to enter email and password. On submit
 * it sends a request to the backend to authenticate. Success or
 * failure messages can be displayed via the alert component.
 */
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      // In a real app you would store the token in localStorage or context
      console.log(res.data);
      navigate('/app/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في تسجيل الدخول');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">تسجيل الدخول</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-green-800"
        >
          تسجيل الدخول
        </button>
      </form>
      <p className="mt-4 text-sm">
        لا تملك حسابًا؟{' '}
        <Link to="/register" className="text-accent hover:underline">
          إنشاء حساب
        </Link>
      </p>
    </div>
  );
}

export default Login;