import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Pricing from './pages/Pricing';
import Account from './pages/Account';

/**
 * Top‑level component defining application routes and a simple header.
 * The header includes navigation links styled with Tailwind and uses
 * the primary/accent colors defined in tailwind.config.js. In a real
 * application you would conditionally render links based on the
 * authentication state.
 */

function Header() {
  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">SevenAI</Link>
      </div>
      <nav className="space-x-4">
        <Link to="/app/chat" className="hover:underline">
          الدردشة
        </Link>
        <Link to="/pricing" className="hover:underline">
          الأسعار
        </Link>
        <Link to="/account" className="hover:underline">
          الحساب
        </Link>
        <Link to="/login" className="hover:underline">
          تسجيل الدخول
        </Link>
      </nav>
    </header>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/app/chat" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app/chat" element={<Chat />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/account" element={<Account />} />
          {/* Catch‑all route */}
          <Route path="*" element={<Navigate to="/app/chat" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;