'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, login } from '@/lib/api';
import { ThemeToggle } from '@/components/theme';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="b-login">
      <div className="b-login__theme">
        <ThemeToggle />
      </div>
      <div className="b-login__card">
        <div className="b-login__bar">
          <span className="d" style={{ background: '#e0625b' }} />
          <span className="d" style={{ background: '#e3b341' }} />
          <span className="d" style={{ background: '#3fb950' }} />
          <span style={{ marginLeft: 6 }}>coach — sign in</span>
        </div>
        <h1>
          <span className="sq">C</span> Coach
        </h1>
        <p className="sub">$ auth --user pessoal</p>
        <form onSubmit={onSubmit}>
          <div className="b-field">
            <label htmlFor="email">email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="b-field">
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="b-login__err">{error}</p>}
          <button type="submit" className="b-btn" disabled={loading}>
            {loading ? 'entrando…' : 'entrar →'}
          </button>
        </form>
        <div className="foot">uso pessoal · single user</div>
      </div>
    </div>
  );
}
