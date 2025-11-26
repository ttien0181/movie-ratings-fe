import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { Mail, Lock, KeyRound, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await authService.sendForgotPasswordCode({ email });
      setMessage('Reset code sent to your email.');
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword({ email, verificationCode, newPassword });
      alert('Password reset successfully! You can now login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-brand-800 p-8 rounded-2xl border border-brand-700 shadow-xl relative">
        <Link to="/login" className="absolute top-8 left-8 text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
        </Link>
        <div className="text-center pt-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-400">
            {step === 1 ? "Enter your email to receive a reset code" : "Enter the code and your new password"}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded text-sm text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded text-sm text-center">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
            <div>
              <label className="block text-sm font-medium leading-6 text-white">Email address</label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 bg-brand-900 py-2 pl-10 text-white shadow-sm ring-1 ring-inset ring-brand-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-brand-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-50 transition-all"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleReset}>
            <div>
              <label className="block text-sm font-medium leading-6 text-white">Verification Code</label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="block w-full rounded-md border-0 bg-brand-900 py-2 pl-10 text-white shadow-sm ring-1 ring-inset ring-brand-700 focus:ring-2 focus:ring-inset focus:ring-brand-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-white">New Password</label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-md border-0 bg-brand-900 py-2 pl-10 text-white shadow-sm ring-1 ring-inset ring-brand-700 focus:ring-2 focus:ring-inset focus:ring-brand-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-brand-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-50 transition-all mt-6"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};