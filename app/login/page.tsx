"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const res = await signIn('credentials', {
      redirect: false,
      username: form.username.value,
      password: form.password.value,
    });
    setLoading(false);
    if (res?.error) setError('Identifiants invalides');
    else window.location.href = '/';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-4">Connexion</h1>
        <div>
          <label className="block mb-1 font-medium text-blue-800">Nom d'utilisateur</label>
          <input name="username" required className="border-2 border-blue-200 rounded px-3 py-2 w-full focus:border-blue-400" placeholder="admin" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-blue-800">Mot de passe</label>
          <input name="password" type="password" required className="border-2 border-blue-200 rounded px-3 py-2 w-full focus:border-blue-400" placeholder="admin" />
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
} 