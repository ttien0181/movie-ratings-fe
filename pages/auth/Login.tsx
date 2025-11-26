import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, ApiError } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { ErrorDetail } from '../../types';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [apiErrors, setApiErrors] = useState<ErrorDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');
    setApiErrors([]);

    try {
      const response = await authService.login({ email, password });
      login(response);
      navigate('/movies');
    } catch (err: any) {
      if (err instanceof ApiError && err.errors.length > 0) {
        setApiErrors(err.errors);
      } else {
        setGeneralError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-brand-800 p-8 rounded-2xl border border-brand-700 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Sign in</h2>
          <p className="mt-2 text-sm text-gray-400">
            Or <Link to="/register" className="font-medium text-brand-400 hover:text-brand-300">create a new account</Link>
          </p>
        </div>
        
        {(generalError || apiErrors.length > 0) && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                {generalError && <p>{generalError}</p>}
                {apiErrors.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {apiErrors.map((err, idx) => (
                      <li key={idx}>{err.errorMessage}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">Email address</label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 bg-brand-900 py-2 pl-10 text-white shadow-sm ring-1 ring-inset ring-brand-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-500 sm:text-sm sm:leading-6"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Password</label>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-brand-400 hover:text-brand-300">Forgot password?</Link>
                </div>
              </div>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 bg-brand-900 py-2 pl-10 text-white shadow-sm ring-1 ring-inset ring-brand-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-500 sm:text-sm sm:leading-6"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-brand-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-50 transition-all"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};