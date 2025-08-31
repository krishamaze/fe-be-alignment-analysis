import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { loginUser, selectAuthStatus } from '@/redux/slice/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await dispatch(loginUser({ username: email, password })).unwrap();
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err || 'Login failed');
    }
  };

  return (
    <div className="min-h-app flex items-center justify-center bg-white px-4 py-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h2
            className="text-xl font-semibold text-gray-800"
            style={{ marginTop: '15%' }}
          >
            Login
          </h2>
          <p className="text-sm text-gray-500">Access your account</p>
        </div>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-keyline"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-keyline"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-gray-700 hover:text-keyline hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
